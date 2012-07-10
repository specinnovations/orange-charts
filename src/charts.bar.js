(function( Raphael , undefined  ){ 

var BarChart = function( paper , x , y , chartWidth , chartHeight , values , options ) {
	
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
    
    var paddingTop = 30;
    var paddingBottom = 5;
    var paddingLeft = 5;
    var paddingRight = 5;
    
    var gutterWidth = 5;
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
    	barBaseLine = x + chartWidth + paddingLeft - paddingRight;
    }
    
    var yaxis = {
    	"x"      : barBaseLine,
    	"y"      : y + paddingTop,
    	"height" : chartHeight - paddingBottom + paddingTop
    };
    
    var xaxis = {
    	"x"     : x + paddingLeft,
    	"y"     : y+  paddingTop,
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
	    	interval = 10;
	    } else if( maxValue > 1000 || minValue < -1000 ) {
	    	interval = 100;
	    } else {
	    	interval = 1;
	    }
	    
	    for( var i=(minValue < 0) ? minValue : 1, ii=maxValue; i<=ii; i++ ) {
	    	
	    	if( i % interval == 0 ) {
	    			
	    		var path = [
	        	            "M" , xaxis.x + (factor*counter) , xaxis.y - 3,
	        	            "L" , xaxis.x + (factor*counter) , xaxis.y + 3
	        	            ];
	        	
	        	labels.push( paper.text( xaxis.x + (factor*counter) , xaxis.y - 20, i ).transform( "r90" ).attr( 'font' , options.labelFont ) );
	        	borders.push( paper.path( path.join(",") ) );
	        	
	    	}
	    	
	    	counter++;
	    	
	    }
    	
    }
                                   
    for( var i=0, ii=barValues.length; i<ii; i++ ) {
        
        var value = barValues[i];
        var object = values[i];
        
        var height = value * factor;
        var barX = yaxis.x + height;
        var barY = xaxis.y + (bars.length * (barWidth + gutterWidth)) + gutterWidth;
        
        var path = [
                    "M" , yaxis.x, barY,
                    "L" , barX, barY,
                    "L" , barX, barY+barWidth,
                    "L" , yaxis.x, barY+barWidth
        ];
        
        var el = paper.path( path.join(",") ).attr("fill",  object.fill || options.fill || "blue" )
        									 .attr( "stroke" , object.stroke || options.stroke || "black" );
        
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

Raphael.fn.bar = function( x , y , width , height , values , options ) {
    return new BarChart( this , x , y , width , height , values , options  );
};
 
})( Raphael);