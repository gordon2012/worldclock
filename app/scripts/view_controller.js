(function($) {

	var namespaces = $.app.namespaces,
			clock = namespaces.models.Clock,
			timeZoneManager = namespaces.managers.TimeZoneManager,
			clockList = $('#clockList'),
			zoneList = $('#zoneList'),
			addClockLink = $('a#addClockLink'),
			editLink = $('a#editLink');

	var MainViewController = {
		initialize: function() {

			this.configureListeners();

			zoneList.hide();
			this.refreshClockList();
			clock.start();

			//timeZoneManager.fetchTimeZones();
			timeZoneManager.initialize();
		},

		configureListeners: function() {
			this.openZoneListFunction = _.bind(this.addClockClicked, this);
			this.closeZoneListFunction = _.bind(this.dismissZoneList, this);
			this.editFunction = _.bind(this.presentEditMode, this);
			this.doneEditingFunction = _.bind(this.dismissEditMode, this);
			this.deleteFunction = _.bind(this.deleteClockClicked, this);

			addClockLink.click(this.openZoneListFunction);
			editLink.click(this.editFunction);
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
			var zones = timeZoneManager.savedZones(true),
					template = $('#clockTemplate').text();

			clockList.empty();

			_.each(zones, function(zone, index) {
				this.createClock(zone, index, template);
			}, this);

			$('.delete-clock-link').hide();
			this.dismissEditMode();

			clock.tick();
		},

		createClock: function(zone, index, template) {
			var item = $(Mustache.render(template, zone)),
					deleteLink = item.find('.delete-clock-link');

			if(zone.isCurrent) {
				deleteLink.remove();
			} else {
				deleteLink.data('clockIndex', index - 1);
				deleteLink.click(this.deleteFunction)
			}

			clockList.append(item);
		},

		deleteClockClicked: function(event) {
			var clickedLink = $(event.currentTarget),
					index = clickedLink.data('clockIndex'),
					parentDiv = clickedLink.parents('.clock');
			timeZoneManager.deleteZoneAtIndex(index);
			// TODO: fix clock not being removed when delete clicked top to bottom
			parentDiv.remove();
		},

		presentEditMode: function() {
			$('.delete-clock-link').show();
			editLink.text('Done');
			editLink.off('click').click(this.doneEditingFunction);
		},

		dismissEditMode: function() {
			$('.delete-clock-link').hide();
			editLink.text('Edit');
			editLink.off('click').click(this.editFunction);
		}

	}

	$.app.register("controllers.MainViewController", MainViewController);
})(jQuery);
