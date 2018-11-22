var Runner = function(name, historyPositions) {
    this.name = name;
    this.historyPositions = historyPositions;

    var actualIx = 0;

    this.run = function(callback) {
        var self = this;
        setTimeout(function() {
            callback(historyPositions[actualIx]);
            actualIx += 1;
            if(actualIx < historyPositions.length) {
                self.run(callback);
            }
        }, 1000);
    }
};

