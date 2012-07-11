(function( Raphael , undefined  ){ 

var ColumnChart = function( paper , x , y , chartWidth , chartHeight , values , options ) {
	
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
    
    var paddingTop = 5;
    var paddingBottom = (options.labels) ? 40 : 5;
    var paddingLeft = ((options.labels) ? 100 : 5);
    var paddingRight = 5;
    
    var gutterWidth = 5;
    var barWidth = (chartWidth - paddingLeft - paddingRight)/barValues.length - gutterWidth - (gutterWidth/barValues.length);
    
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
    	borders.push(paper.path([
    	                         "M" , xaxis.x , xaxis.y,
    	                         "L" , xaxis.x + xaxis.width , xaxis.y
    	                         ].join(",")));
    }
    
    if( options.yaxis !== false ) {
    	borders.push(paper.path([
    	                         "M" , yaxis.x , yaxis.y,
    	                         "L" , yaxis.x , yaxis.y + yaxis.height
    	                         ].join(",")));
    }
    
    if( options.labels !== false ) {
    	
    	var counter = 0;
	    var interval = 1;
	    
	    if( maxValue > 100 || minValue < -100 ) {
	    	interval = 15;
	    } else if( maxValue > 500 || minValue < -500 ) {
	    	interval = 50;
	    } else if( maxValue > 1000 || minValue < -1000 ) {
	    	interval = 100;
	    } else {
	    	interval = 10;
	    }
	    
	    for( var i=(minValue < 0) ? minValue : 1, ii=maxValue; i<=ii; i++ ) {
	    	
	    	if( i % interval == 0 ) {
	    			
	    		var path = [
	        	            "M" , xaxis.x - 3 , yaxis.y + yaxis.height - (factor*counter),
	        	            "L" , xaxis.x + 3 , yaxis.y + yaxis.height - (factor*counter)
	        	            ];
	        	
	        	borders.push( paper.path( path.join(",") ) );
	        	
	    	}
	    	
	    	if( i % (interval*2) == 0 ) {
	    		labels.push( paper.text( yaxis.x - 25 , yaxis.y + yaxis.height - (factor * counter) , i ).attr( 'font' , options.labelFont ) );
	    	}
	    	
	    	counter++;
	    	
	    }
    	
    }
                                   
    for( var i=0, ii=barValues.length; i<ii; i++ ) {
        
        var value = barValues[i];
        var object = values[i];
        
        var height = value * factor;
        var barX = yaxis.x + (bars.length * (barWidth + gutterWidth)) + gutterWidth;
        var barY = xaxis.y - height;
        
        var path = [
                    "M" , barX, xaxis.y,
                    "L" , barX, barY,
                    "L" , barX+barWidth, barY,
                    "L" , barX+barWidth, xaxis.y
        ];
        
        var el = paper.path( path.join(",") ).attr("fill",  object.fill || options.fill || "blue" )
        									 .attr( "stroke" , object.stroke || options.stroke || "black" );
        
        el.x = barX+ (barWidth/2);
        el.top = barY;
        el.bottom = xaxis.y;
        
        if( Raphael.is( object , "object" ) ) {
        	delete object.value;
        	delete object.fill;
        	delete object.stroke;
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
    
    return result;
    
};

Raphael.fn.column = function( x , y , width , height , values , options ) {
    return new ColumnChart( this , x , y , width , height , values , options  );
};
 
})( Raphael);