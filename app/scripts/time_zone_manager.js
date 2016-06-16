(function($) {
	var TimeZoneManager = {
		savedTimeZones: [],

		fetchTimeZones: function(completion) {
			var successFunction = _.bind(function(data) {
				this.timeZones = data;
				if(completion) completion(data);
			}, this);

			$.ajax({
				url: 'http://localhost:3000/clock/time_zones',
				headers: { Accept: 'application/json'},
				success: successFunction
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
		},

		allZones: function() {
			return this.timeZones;
		},

		deleteZoneAtIndex: function(index) {
			this.savedTimeZones.splice(index, 1);
		}

	};
	$.app.register('managers.TimeZoneManager', TimeZoneManager);
})(jQuery);
