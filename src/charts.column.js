(function( Raphael , undefined  ){ 

var ColumnChart = function( paper , x , y , chartWidth , chartHeight , values , options ) {
  
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
    var paddingBottom = (options.labels) ? 30 : 5;
    var paddingLeft = ((options.labels) ? 75 : 5);
    var paddingRight = 5;
    
    var gutterWidth = 5;
    var barWidth = (chartWidth - paddingLeft - paddingRight)/barValues.length - gutterWidth - (gutterWidth/barValues.length);
    
    var maxValue = Math.max.apply( Math , barValues );
    var minValue = Math.min.apply( Math , barValues );
    
    console.log( "Min Value: " , minValue , "Max Value: " , maxValue );
    
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
    
    console.log( "Bar Width: " , barWidth );
    console.log( "Factor: " , factor );
    
    var bars = [];
    var borders = [];
    var labels = [];
    
    var borderPath = [
                      "M" , yaxis.x , yaxis.y,
                      "L" , yaxis.x , yaxis.y + yaxis.height,
                      "M" , xaxis.x , xaxis.y,
                      "L" , xaxis.x + xaxis.width , xaxis.y
                      ];
    
    borders.push( paper.path( borderPath.join(",") ) );
    
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
        	            "M" , xaxis.x - 3 , yaxis.y + yaxis.height - (factor*counter),
        	            "L" , xaxis.x + 3 , yaxis.y + yaxis.height - (factor*counter)
        	            ];
        	
        	labels.push( paper.text( yaxis.x - 25 , yaxis.y + yaxis.height - (factor * counter) , i ) );
        	borders.push( paper.path( path.join(",") ) );
        	
    	}
    	
    	counter++;
    	
    }
                                   
    for( var i=0, ii=barValues.length; i<ii; i++ ) {
        
        var value = barValues[i];
        
        var height = value * factor;
        var barX = yaxis.x + (bars.length * (barWidth + gutterWidth)) + gutterWidth;
        var barY = xaxis.y - height;
        
        console.log( "Bar: " , barX , barY , height );
        
        var path = [
                    "M" , barX, xaxis.y,
                    "L" , barX, barY,
                    "L" , barX+barWidth, barY,
                    "L" , barX+barWidth, xaxis.y
        ];
        
        var el = paper.path( path.join(",") ).attr("fill", "blue");
        
        bars.push( el );
        
    }
    
    return [ bars , borders, labels ];
    
};

Raphael.fn.columnChart = function( x , y , width , height , values , options ) {
    return new ColumnChart( this , x , y , width , height , values , options  );
};
 
})( Raphael);