var IndexController = Ember.ObjectController.extend({

    checkDigit: function() {
    
        function charValue(c) {
            if (c >= '0' && c <= '9') {
                return +c;
            } else if (c >= 'A' && c <= 'Z') {
                return c.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
            } else if (c >= 'a' && c <= 'z') {
                return c.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
            } else
                return 0;
        }
        
        var rslt = 0,
            factor = 2,
            input = this.get('input');
        if (input) {    
            for (var i = input.length - 1; i >= 0; i--) {
                var value = factor * charValue(input.charAt(i));
                if (value >= 10) {
                    value = Math.floor(value / 10) + (value % 10);
                }
                factor = 3 - factor;
                rslt = rslt + value;
            }    
        }
        while (rslt > 0) {
            rslt = rslt - 10;
        }
        return - rslt;
    }.property('input')
        
});

export default IndexController;
