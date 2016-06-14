(function($) {
	var Clock = {
		tick: function(hourType) {
			var hourType = hourType || false;

			var date = new Date();

			var hours = date.getHours();
			hours = hourType ? (hours == 12 ? 12 : hours % 12) : hours;

			var text = "" + hours + ":" + this.zeroPad(date.getMinutes()) + ":" + this.zeroPad(date.getSeconds()) + " " + (hourType ? (date.getHours() >= 12 ? "pm" : "am") : "");

			$(".clock").text(text);
		},

		zeroPad: function(number) {
			var s = number.toString();
			var formattedNumber = (s.length > 1) ? s : "0" + s;
			return formattedNumber;
		}
	};

	$.app.register("models.Clock", Clock);
})(jQuery);
