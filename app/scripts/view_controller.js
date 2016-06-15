(function($) {

	var namespaces = $.app.namespaces,
			clock = namespaces.models.Clock,
			timeZoneManager = namespaces.managers.TimeZoneManager,
			clockList = $('#clockList'),
			zoneList = $('#zoneList'),
			addClockLink = $('a#addClockLink');

	var MainViewController = {
		initialize: function() {
			this.openZoneListFunction = _.bind(this.addClockClicked, this);
			this.closeZoneListFunction = _.bind(this.dismissZoneList, this);
			addClockLink.click(this.openZoneListFunction);
			zoneList.hide();
			this.refreshClockList();
			clock.start();

			timeZoneManager.fetchTimeZones();
		},

		addClockClicked: function() {
			if(zoneList.children().length === 0) {
				var zones = timeZoneManager.allZones();
				clickHandler = _.bind(this.zoneClicked, this);
				_.each(zones, function(zone, index) {
					var item = $('<li class="zone"/>');
					item.data('zoneIndex', index);
					item.text(zone.name);
					item.click(clickHandler);
					zoneList.append(item);
				});
			}
			this.presentZoneList();
		},

		zoneClicked: function(event) {
			var item = $(event.currentTarget),
					index = item.data('zoneIndex');
			timeZoneManager.saveZoneAtIndex(index);
			this.dismissZoneList();
			this.refreshClockList();
		},

		presentZoneList: function() {
			addClockLink.text('Cancel');
			addClockLink.click(this.closeZoneListFunction);
			zoneList.show();
		},

		dismissZoneList: function() {
			addClockLink.text('Add Clock');
			addClockLink.click(this.openZoneListFunction);
			zoneList.hide();
		},

		refreshClockList: function() {
			clockList.empty();
			timeZoneManager.createClocksIn(clockList);
			clock.tick();
		}

	}

	$.app.register("controllers.MainViewController", MainViewController);
})(jQuery);
