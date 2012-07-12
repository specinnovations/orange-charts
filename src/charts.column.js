(function( Raphael , undefined  ){ 

	var ColumnChart = function( paper , x , y , chartWidth , chartHeight , values , options ) {
		
		options = options || {};
		options.labels = (options.labels !== false);
		options.labelFont = options.labelFont || "10px sans-serif";
		
		var paddingTop = options.paddingTop = options.paddingTop || 5;
		var paddingBottom = options.paddingBottom = options.paddingBottom || options.labels ? 20 : 5;
		var paddingLeft = options.paddingLeft = options.paddingLeft || options.labels ? 20 : 5;
		var paddingRight = options.paddingRight = options.paddingRight || 5;
		var gutterWidth = options.gutterWidth = options.gutterWidth || 5;
		
	  
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
	    	factor = (chartHeight - paddingBottom + paddingTop)/( maxValue + (minValue*-1) );
	    	barBaseLine = y + chartHeight - paddingBottom + paddingTop*2 - (minValue*-1*factor);
	    } else {
	    	factor = (chartHeight - paddingBottom - paddingTop)/( maxValue );
	    	barBaseLine = y + chartHeight - paddingBottom + paddingTop*2;
	    }
	    
	    var yaxis = {
	    	"x"      : x + paddingLeft,
	    	"y"      : y + paddingTop,
	    	"height" : chartHeight - paddingBottom + paddingTop
	    };
	    
	    var xaxis = {
	    	"x"     : x + paddingLeft,
	    	"y"     : barBaseLine,
	    	"width" : chartWidth - paddingLeft - paddingRight
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
	    
	    if( options.labels !== false ) {
	    	
	    	var counter = 0;
		    var interval = 1;
		    
		    if( maxValue > 1000 || minValue < -1000 ) {
		    	interval = 100;
		    } else if( maxValue > 500 || minValue < -500 ) {
		    	interval = 50;
		    } else if( maxValue > 100 || minValue < -100 ) {
		    	interval = 15;
		    } else {
		    	interval = 10;
		    }
		    
		    for( var i=(minValue < 0) ? minValue : 1, ii=maxValue; i<=ii; i++ ) {
		    	
		    	if( i % interval == 0 ) {
		    			
		    		var path = "M" + (xaxis.x - 3)  + "," +  (yaxis.y + yaxis.height - (factor*counter)) +
		        	            "L" + (xaxis.x + 3)  + "," +  (yaxis.y + yaxis.height - (factor*counter));
		        	
		        	borders.push( paper.path( path ) );
		        	
		    	}
		    	
		    	if( i % (interval*2) == 0 ) {
		    		labels.push( paper.text( yaxis.x - 25 , yaxis.y + yaxis.height - (factor * counter) , i ).attr( 'font' , options.labelFont ) );
		    	}
		    	
		    	counter++;
		    	
		    }
	    	
	    }
	                                   
	    for( var i=0, ii=values.length; i<ii; i++ ) {
	    	
	    	 var value;
	    	 var object = values[i];
	         
	        if( Raphael.is( values[i] , "object" ) ) {
	            value = parseInt(values[i].value);                
	        } else {
	            value = parseInt(values[i]);
	        }
	        
	        var height = value * factor;
	        var barX = yaxis.x + (bars.length * (barWidth + gutterWidth)) + gutterWidth;
	        var barY = xaxis.y - height;
	        
	        var path =  "M" + barX + "," + xaxis.y +
	                    "L" + barX + "," + xaxis.y +
	                    "L" + (barX+barWidth) + "," + xaxis.y +
	                    "L" + (barX+barWidth) + "," + xaxis.y;
	        
	        var el = paper.path( path ).attr("fill",  object.fill || options.fill || "blue" )
	        									 .attr( "stroke" , object.stroke || options.stroke || "black" );
	        
	        el.animate({ "path" : "M" + barX + "," + xaxis.y +
                "L" + barX + "," + barY +
                "L" + (barX+barWidth) + "," + barY +
                "L" + (barX+barWidth) + "," + xaxis.y } , 1000 );
	        
	        el.x = barX+ (barWidth/2);
	        el.top = barY;
	        el.bottom = xaxis.y;
	        
	        if( Raphael.is( object , "object" ) ) {
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