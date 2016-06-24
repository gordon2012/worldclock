(function($) {
	var TimeZoneManager = {
		savedTimeZones: [],

		initialize: function() {
			this.loadSavedLocalTimeZones();

			if(!navigator.onLine) {
				this.loadLocalTimeZones();
			} else {
				var completion = _.bind(function(zones) {
					this.storeTimeZonesLocally(zones);
				}, this);
				this.fetchTimeZones(completion);
			}
		},

		loadLocalTimeZones: function() {
			//console.log('TZM: LLTZ');
			var localZones = localStorage.allTimeZones;
			if(localZones) {
				this.zonesLoaded(JSON.parse(localZones));
			} else {
				// no timezone data available
			}
		},

		loadSavedLocalTimeZones: function() {
			//console.log('TZM: LSLTZ');
			var localSavedZones = localStorage.savedTimeZones;
			if(localSavedZones) {
				this.savedTimeZones = JSON.parse(localSavedZones);
			}
		},

		storeTimeZonesLocally: function(zones) {
			localStorage.allTimeZones = JSON.stringify(zones);
		},

		zonesLoaded: function(zones) {
			this.timeZones = zones;
		},

		fetchTimeZones: function(completion) {
			var successFunction = _.bind(function(data) {
				this.zonesLoaded(data);
				if(completion) completion(data);
			}, this);

			var errorFunction = _.bind(function() {
				this.loadLocalTimeZones();
			}, this);

			$.ajax({
				url: 'http://localhost:3000/clock/time_zones',
				headers: { Accept: 'application/json'},
				success: successFunction,
				error: errorFunction
			});
		},

		savedZones: function(includeCurrent) {
			var zones = [];
			if(includeCurrent) {
				var refDate = new Date();
				var offsetMinutes = refDate.getTimezoneOffset();
				zones.push({
					name: "Current",
					zone_name: "Current",
					offset: -offsetMinutes * 60,
					formatted_offset: this.formatOffsetMinutes(-offsetMinutes),
					isCurrent: true
				});
			}
			return zones.concat(this.savedTimeZones);
		},

		formatOffsetMinutes: function(offsetMinutes) {
			var offsetHours = offsetMinutes / 60;
			offsetHours = Math.abs(offsetHours).toString() + ':00';
			if(offsetMinutes < 600) offsetHours = "0" + offsetHours;
			if(offsetMinutes < 0) offsetHours = "-" + offsetHours;
			return offsetHours;
		},

		__createClocksIn: function(list) {
			var zones = this.savedZones(true);
			_.each(zones, function(zone) {
				var item = $('<li class="clock"/>');
				$(list).append(item);
			});
		},

		saveZoneAtIndex: function(index) {
			var zone = this.timeZones[index];
			this.savedTimeZones.push(zone);
			this.storeSavedTimeZonesLocally();
		},

		allZones: function() {
			return this.timeZones;
		},

		deleteZoneAtIndex: function(index) {
			this.savedTimeZones.splice(index, 1);
			this.storeSavedTimeZonesLocally();
		},

		storeSavedTimeZonesLocally: function() {
			localStorage.savedTimeZones = JSON.stringify(this.savedTimeZones);
		}

	};
	$.app.register('managers.TimeZoneManager', TimeZoneManager);
})(jQuery);
