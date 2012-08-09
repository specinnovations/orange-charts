(function(Raphael) {

    var LineChart = function(paper, x, y, chartWidth, chartHeight, values, options) {
    
    	Raphael.getColor.reset()

        options = options || {};
        options.title = options.title || null;
        options.labels = (options.labels !== false);
        options.labelFont = options.labelFont || "10px sans-serif";
        options.lineWidth = options.lineWidth || 2;

        if(options.colors == null ) {

            options.colors = [];

            for(var i=0; i<values.length; i++) {
                options.colors.push( Raphael.getColor() );
            }

        }

        var paddingTop = options.paddingTop = options.paddingTop || 20;
        var paddingBottom = options.paddingBottom = options.paddingBottom || (options.labels ? 40 : 20);
        var paddingLeft = options.paddingLeft = options.paddingLeft || (options.labels ? 40 : 20);
        var paddingRight = options.paddingRight = options.paddingRight || 10;

        if( options.title ) {
			paper.text( chartWidth/2 + paddingLeft , paddingTop , options.title ).attr({
				"font" : "15px sans-serif",
				"text-anchor" : "middle"
			});
		}

        var xValues = [];
        var yValues = [];

        for(var i = 0, ii = values.length; i < ii; i++) {
            for (var j = 0, jj = values[i].length; j < jj; j++) {
                xValues.push(values[i][j].x);
                yValues.push(values[i][j].y);
            }
        }

        var maxXValue = Math.max.apply(Math, xValues);
        var minXValue = Math.min.apply(Math, xValues);

        var maxYValue = Math.max.apply(Math, yValues);
        var minYValue = Math.min.apply(Math, yValues);

        var xFactor = 1;
        var yFactor = 1;
        var xBaseLine = 0;
        var yBaseLine = 0;

        if(minXValue < 0) {
            xFactor = (chartWidth - paddingLeft - paddingRight) / (maxXValue + (minXValue * -1));
            xBaseLine = x + paddingLeft + (minXValue * -1 * xFactor);
        } else {
            xFactor = maxXValue != 0 ? (chartWidth - paddingLeft - paddingRight) / (maxXValue) : 1;
            xBaseLine = x + paddingLeft;
        }

        if(minYValue < 0) {
            yFactor = (chartHeight - paddingBottom - paddingTop) / (maxYValue + (minYValue * -1));
            yBaseLine = y + chartHeight - paddingBottom + paddingTop - (minYValue * -1 * yFactor);
        } else {
            yFactor = maxYValue != 0 ? (chartHeight - paddingBottom - paddingTop) / (maxYValue) : 1;
            yBaseLine = y + chartHeight - paddingBottom + paddingTop;
        }

        var xaxis = {
            "x": x + paddingLeft,
            "y": yBaseLine,
            "width": chartWidth - paddingLeft - paddingRight
        };

        var yaxis = {
            "x": xBaseLine,
            "y": y + paddingTop*2,
            "height": chartHeight - paddingBottom - paddingTop
        };

        var lines = paper.set();
        var borders = paper.set();
        var labels = paper.set();
        var points = paper.set();

        if(options.xaxis !== false) {
            borders.push(paper.path("M" + xaxis.x + "," + xaxis.y + "L" + (xaxis.x + xaxis.width) + "," + xaxis.y));
        }

        if(options.yaxis !== false) {
            borders.push(paper.path("M" + yaxis.x + "," + yaxis.y + "L" + yaxis.x + "," + (yaxis.y + yaxis.height)));
        }

        borders.attr({
	    	"stroke"         : "#000",
		    "stroke-opacity" : 1,
		    "opacity"        : 1
	    });

        if(options.labels) {

            var xCounter = 0;
            var xInterval = 1;
            
            if (maxXValue > 1000 || minXValue < -1000) {
		    	var value = Math.max( maxXValue , Math.abs( minXValue ) );
				xInterval = Math.floor(value * .1);
		    } else if (maxXValue > 500 || minXValue < -500) {
	            xInterval = 50;
	        } else if (maxXValue > 250 || minXValue < -250) {
	            xInterval = 10;
	        }  else if (maxXValue > 100 || minXValue < -100) {
	            xInterval = 5;
	        } else {
	            xInterval = 2;
	        }

            for(var i = (minXValue < 0) ? minXValue : 0, ii = maxXValue; i <= ii; i++) {

                if (i % xInterval == 0 && i !== 0) {

                    borders.push(paper.path("M" + (xaxis.x + (xFactor * xCounter)) + "," + (xaxis.y - 3) + "L" + (xaxis.x + (xFactor * xCounter)) + "," + (xaxis.y + 3)));

                }

                if (i % (xInterval * 2) == 0  && i !== 0 ) {
                
                	var label = paper.text(xaxis.x + (xFactor * xCounter), xaxis.y + 15, i).attr({
                		"font" : options.labelFont,
                		"text-anchor" : "middle"
                	});
                
                    labels.push(label);
                    
                }

                xCounter++;

            }

            var yCounter = 0;
            var yInterval = 1;

            if(maxYValue > 1000 || minYValue < -1000) {
                yInterval = 100;
            } else if(maxYValue > 500 || minYValue < -500) {
                yInterval = 50;
            } else if(maxYValue > 100 || minYValue < -100) {
                yInterval = 10;
            } else {
                yInterval = 2;
            }

            for(var i=(minYValue < 0) ? minYValue : 0, ii=maxYValue; i <= ii; i++) {

                if(i % yInterval == 0) {

                    var path = "M" + (yaxis.x - 3) + "," + (yaxis.y + yaxis.height - (yFactor * yCounter)) + "L" + (yaxis.x + 3) + "," + (yaxis.y + yaxis.height - (yFactor * yCounter));

                    borders.push(paper.path(path));

                }

                if(i % (yInterval * 2) == 0 || i == 0) {
                
                	var label = paper.text(yaxis.x - 10, yaxis.y + yaxis.height - (yFactor * yCounter), i).attr({
                		"font" : options.labelFont,
                		"text-anchor" : "end"
                	});
                
                    labels.push(label);
                    
                }

                yCounter++;

            }

        }

        for(var i=0, ii=values.length; i<ii; i++) {

            var path = [];
            var color = options.colors[i];

            if(!Raphael.is(values[i], "array")) {
                break;
            }

            for(var j=0, jj=values[i].length; j<jj; j++) {

                var object = values[i][j];

                var xValue = xaxis.x + (object.x * xFactor);
                var yValue = xaxis.y - (object.y * yFactor);

                if(j == 0) {
                    path.push("M" + xValue + "," + yValue);
                } else {
                    path.push("L" + xValue + "," + yValue);
                }


                var circle = paper.circle(xValue, yValue, 5).attr({
                	"fill"   : color,
                	"stroke" : color
                });

                circle.x = xValue;
                circle.y = yValue;
                circle.radius = 5;

                circle.charts = object;

                points.push(circle);

            }

            var element = paper.path(path.join()).attr("stroke", color).attr("stroke-width", options.lineWidth);
            element.charts = object;

            lines.push(element);

        }

        var result = paper.set();

        result.push(lines);
        result.push(borders);
        result.push(labels);
        result.push(points);

        result.lines = lines;
        result.borders = borders;
        result.labels = labels;
        result.points = points;

        result.points.hover = function(fin, fout) {
            return this.mouseover(fin).mouseout(fout);
        };

        result.lines.toFront();
        result.points.toFront();

        return result;

    };

    var ctor = function() {};
    ctor.prototype = Raphael.g;
    LineChart.prototype = new ctor;

    Raphael.fn.linechart = function(x, y, width, height, values, options) {
        return new LineChart(this, x, y, width, height, values, options);
    };

})(Raphael);