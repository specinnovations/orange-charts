(function( Raphael , undefined  ){ 

var BarChart = function( paper , x , y , chartWidth , chartHeight , values , options ) {

	Raphael.getColor.reset();
	
	options = options || {};
	options.title = options.title || null;
	options.labels = (options.labels !== false);
	options.labelFont = options.labelFont || "10px sans-serif";
  
    var barValues = [];
    
    for( var i=0, ii=values.length; i<ii; i++ ) {
        
        var value; 
        
        if( Raphael.is( values[i] , "object" ) ) {
            value = parseInt(values[i].value);                
        } else {
            value = parseInt(values[i]);
        }
        
        barValues.push( value );
        
    }
    
    var paddingTop = options.paddingTop = options.paddingTop || (options.labels ? 60 : 10);
	var paddingBottom = options.paddingBottom = options.paddingBottom || 10;
	var paddingLeft = options.paddingLeft = options.paddingLeft || 10;
	var paddingRight = options.paddingRight = options.paddingRight || 10;
	var gutterWidth = options.gutterWidth = options.gutterWidth || 10;
	
	if( options.title ) {
		paper.text( chartWidth/2 + paddingLeft , 5 , options.title ).attr({
			"font" : "15px sans-serif",
			"text-anchor" : "middle"
		});
	}
   
    var barWidth = (chartHeight - paddingBottom - paddingTop)/barValues.length - gutterWidth - (gutterWidth/barValues.length);
    
    var maxValue = Math.max.apply( Math , barValues );
    var minValue = Math.min.apply( Math , barValues );
    
    var factor = 1;
    var barBaseLine = 0;
    
    if( minValue < 0 ) {
    	factor = (chartWidth - paddingLeft - paddingRight)/( maxValue + (minValue*-1) );
    	barBaseLine = x + paddingLeft + (minValue*-1*factor);
    } else {
    	factor = (chartWidth - paddingLeft - paddingRight)/( maxValue );
    	barBaseLine = x + paddingLeft;
    }
    
     var xaxis = {
    	"x"     : x + paddingLeft,
    	"y"     : y + paddingTop,
    	"width" : chartWidth - paddingLeft - paddingRight
    };
    
    var yaxis = {
    	"x"      : barBaseLine,
    	"y"      : y + paddingTop,
    	"height" : chartHeight - paddingBottom - paddingTop
    };
    
    var bars = paper.set();
    var borders = paper.set();
    var labels = paper.set();
  
    if( options.xaxis !== false ) {
    	borders.push(paper.path( "M" + xaxis.x  + "," +  xaxis.y +
    	                         "L" + (xaxis.x + xaxis.width)  + "," + xaxis.y ));
    }
    
    if( options.yaxis !== false ) {
    	borders.push(paper.path( "M" + yaxis.x + "," + yaxis.y +
    	                         "L" + yaxis.x + "," + (yaxis.y + yaxis.height) ));
    }
    
    borders.attr({
    	"stroke"         : "#000000",
    	"stroke-width"   : 1,
	    "stroke-opacity" : 1,
	    "opacity"        : 1
    });
    
    if( options.labels !== false ) {
    	
    	var counter = 0;
	    var interval = 1;
	    
	    if (maxValue > 1000 || minValue < -1000) {
            interval = 100;
        } else if (maxValue > 500 || minValue < -500) {
            interval = 50;
        } else if (maxValue > 250 || minValue < -250) {
            interval = 10;
        }  else if (maxValue > 100 || minValue < -100) {
            interval = 5;
        } else {
            interval = 2;
        }
	    
	    for( var i=(minValue < 0) ? minValue : 0, ii=maxValue; i<=ii; i++ ) {
	    	
	    	if( i % interval == 0 ) {
	    			
	    		var path =  "M" + (xaxis.x + (factor*counter)) + "," + (xaxis.y - 3) +
	        	            "L" + (xaxis.x + (factor*counter)) + "," + (xaxis.y + 3);
	        	
	        	borders.push( paper.path( path ) );
	        	
	    	}
	    	
	    	if( i % (interval*2) == 0 || i == 0 ) {
		    		
	    		var label = paper.text( xaxis.x + (factor*counter) , xaxis.y - 15 , i ).attr({
	    			"font"        : options.labelFont,
	    			"text-anchor" : "end"
	    		}).transform( "r90" );
	    		
	    		label.translate( 0 , (label.getBBox().height/2)*-1 );
	    	
	    		labels.push( label );
	    		
	    	}
	    	
	    	counter++;
	    	
	    }
    	
    }
                                   
    for( var i=0, ii=values.length; i<ii; i++ ) {
        
        var object = values[i];
        var value = object.value;
        var color = object.color || Raphael.getColor();
        
        var height = value * factor;
        var barX = yaxis.x + height;
        var barY = xaxis.y + (bars.length * (barWidth + gutterWidth)) + gutterWidth;
        var bottom = (yaxis.x+((value < 0) ? -1 : 1));
        
        var path = "M" + bottom  + "," + barY +
                   "L" + bottom + "," + barY +
                   "L" + bottom + "," + (barY+barWidth)+
                   "L" + bottom + "," + (barY+barWidth);
	        
        var el = paper.path( path ).attr({
	        "fill"   : color,
	        "stroke" : color
        });
        
        el.animate({ "path" : "M" + bottom + "," + barY +
                    "L" + barX + "," + barY +
                    "L" + barX + "," + (barY+barWidth) +
                    "L" + bottom + "," + (barY+barWidth) } , 1000 );
        
        el.bottom = yaxis.x;
        el.top = barX;
        el.y = barY+barWidth/2;
        
        if( Raphael.is( object , "object" ) ) {
        
        	if( options.labels ) {
	        	
	        	var label = paper.text( el.bottom + ((value < 0) ? 10 : -10) , el.y , object.label ).attr({
		        	"text-anchor" : ((value < 0) ? "start" : "end"),
		        	"font"        : options.labelFont
	        	});
	        	
	        	el.label = label;
	        	
        	}
        
        	el.charts = object;
        }
        
        bars.push( el );
        
    }
    
    var result = paper.set();
    
    result.push( bars );
    result.push( borders );
    result.push( labels );

    result.bars = bars;
    result.borders = borders;
    result.labels = labels;
    
    result.bars.toFront();
    result.labels.toFront();
    
    return result;
    
};

var ctor = function() {};
ctor.prototype = Raphael.g;
BarChart.prototype = new ctor;

Raphael.fn.barchart = function( x , y , width , height , values , options ) {
    return new BarChart( this , x , y , width , height , values , options  );
};
 
})( Raphael );