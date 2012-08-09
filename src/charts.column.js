(function( Raphael , undefined  ){ 

	var ColumnChart = function( paper , x , y , chartWidth , chartHeight , values , options ) {
	
		Raphael.getColor.reset();
		
		options = options || {};
		options.title = options.title || null;
		options.labels = (options.labels !== false);
		options.labelFont = options.labelFont || "10px sans-serif";
		
		var paddingTop = options.paddingTop = options.paddingTop || 10;
		var paddingBottom = options.paddingBottom = options.paddingBottom || (options.labels ? 30 : 5);
		var paddingLeft = options.paddingLeft = options.paddingLeft || (options.labels ? 55 : 5);
		var paddingRight = options.paddingRight = options.paddingRight || 5;
		var gutterWidth = options.gutterWidth = options.gutterWidth || 5;
		
		if( options.title ) {
			paper.text( chartWidth/2 + paddingLeft , 5 , options.title ).attr({
				"font" : "15px sans-serif",
				"text-anchor" : "middle"
			});
		}
	  
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
	    
	    var barWidth = (chartWidth - paddingLeft - paddingRight)/values.length - gutterWidth - (gutterWidth/values.length);
	    
	    var maxValue = Math.max.apply( Math , barValues );
	    var minValue = Math.min.apply( Math , barValues );
	    
	    var factor = 1;
	    var barBaseLine = 0;
	    
	    if( minValue < 0 ) {
	    	factor = (chartHeight - paddingBottom - paddingTop)/( maxValue + (minValue*-1) );
	    	barBaseLine = y + chartHeight - paddingBottom - (minValue*-1*factor);
	    } else {
	    	factor = (chartHeight - paddingBottom - paddingTop)/( maxValue );
	    	barBaseLine = y + chartHeight - paddingBottom;
	    }
	    
	     var xaxis = {
	    	"x"     : x + paddingLeft,
	    	"y"     : barBaseLine,
	    	"width" : chartWidth - paddingLeft - paddingRight
	    };
	    
	    var yaxis = {
	    	"x"      : x + paddingLeft,
	    	"y"      : y + paddingTop,
	    	"height" : chartHeight - paddingTop - paddingBottom
	    };
	    
	    var bars = paper.set();
	    var borders = paper.set();
	    var labels = paper.set();
	  
	    
	    if( options.xaxis !== false ) {
	    	borders.push(paper.path(
	    	                         "M" + xaxis.x  + "," +  xaxis.y +
	    	                         "L" + (xaxis.x + xaxis.width) + "," +  xaxis.y));
	    }
	    
	    if( options.yaxis !== false ) {
	    	borders.push(paper.path("M" + yaxis.x  + "," +  yaxis.y +
	    	                         "L" + yaxis.x  + "," +  (yaxis.y + yaxis.height)
	    	                         ));
	    }
	    
	    borders.attr({
	    	"stroke"         : "#000",
		    "stroke-opacity" : 1,
		    "opacity"        : 1
	    });
	    
	    if( options.labels ) {
	    	
	    	var counter = 0;
		    var interval = 1;
		    
		    if (maxValue > 1000 || minValue < -1000) {
				   
		    	var value = Math.max( maxValue , Math.abs( minValue ) );
				   
				interval = Math.floor(value * .1);
		           
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
		    			
		    		var path = "M" + (xaxis.x - 3)  + "," +  (yaxis.y + yaxis.height - (factor*counter)) +
		        	            "L" + (xaxis.x + 3)  + "," +  (yaxis.y + yaxis.height - (factor*counter));
		        	
		        	borders.push( paper.path( path ) );
		        	
		    	}
		    	
		    	if( i % (interval*2) == 0 || i == 0 ) {
		    		
		    		var label = paper.text( yaxis.x - 10 , yaxis.y + yaxis.height - (factor * counter) , i ).attr({
		    			"font"        : options.labelFont,
		    			"text-anchor" : "end"
		    		});
		    	
		    		labels.push( label );
		    		
		    	}
		    	
		    	counter++;
		    	
		    }
	    	
	    }
	                                   
	    for( var i=0, ii=values.length; i<ii; i++ ) {
	    	
	    	 var value;
	    	 var object = values[i];
	    	 var color = object.color || Raphael.getColor();
	         
	        if( Raphael.is( values[i] , "object" ) ) {
	            value = parseInt(values[i].value);                
	        } else {
	            value = parseInt(values[i]);
	        }
	        
	        var height = value * factor;
	        var barX = yaxis.x + (bars.length * (barWidth + gutterWidth)) + gutterWidth;
	        var barY = xaxis.y - height;
	        var bottom = (xaxis.y+((value < 0) ? 1 : -1));
	        
	        var path =  "M" + barX + "," + bottom +
	                    "L" + barX + "," + bottom +
	                    "L" + (barX+barWidth) + "," + bottom +
	                    "L" + (barX+barWidth) + "," + bottom;
	        
	        var el = paper.path( path ).attr({
		        "fill"   : color,
		        "stroke" : color
	        });
	        
	        el.animate({ "path" : "M" + barX + "," + bottom +
                "L" + barX + "," + barY +
                "L" + (barX+barWidth) + "," + barY +
                "L" + (barX+barWidth) + "," + bottom } , 1000 );
	        
	        el.x = barX+ (barWidth/2);
	        el.top = barY;
	        el.bottom = bottom;
	        
	        if( Raphael.is( object , "object" ) ) {
	        
	        	if( options.labels ) {
		        	
		        	var label = paper.text( el.x , el.bottom + ((value < 0) ? -10 : 10) , object.label ).attr({
			        	"text-anchor" : "middle",
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
ColumnChart.prototype = new ctor;

Raphael.fn.columnchart = function( x , y , width , height , values , options ) {
    return new ColumnChart( this , x , y , width , height , values , options  );
};
 
})( Raphael );