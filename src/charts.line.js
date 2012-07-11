(function( Raphael , undefined  ){ 

var LineChart = function( paper , x , y , chartWidth , chartHeight , values , options ) {
	
	options = options || {};
	options.labels = (options.labels !== false);
	options.labelFont = options.labelFont || "10px sans-serif";
	
	var paddingTop = options.paddingTop = options.paddingTop || 10;
	var paddingBottom = options.paddingBottom = options.paddingBottom || options.labels ? 30 : 10;
	var paddingLeft = options.paddingLeft = options.paddingLeft || options.labels ? 30 : 10;
	var paddingRight = options.paddingRight = options.paddingRight || 10;
	
  
    var xValues = [];
    var yValues = [];
    
    for( var i=0, ii=values.length; i<ii; i++ ) {
    	for( var j=0, jj=values[i].length; j<jj; j++ ) {
    		xValues.push( parseInt(values[i][j].x) );
        	yValues.push( parseInt(values[i][j].y) );
    	}
    }
    
    var maxXValue = Math.max.apply( Math , xValues );
    var minXValue = Math.min.apply( Math , xValues );
    
    var maxYValue = Math.max.apply( Math , yValues );
    var minYValue = Math.min.apply( Math , yValues );
    
    var xFactor = 1;
    var yFactor = 1;
    var xBaseLine = 0;
    var yBaseLine = 0;
    
    if( minXValue < 0 ) {
    	xFactor = (chartWidth - paddingLeft - paddingRight)/( maxXValue + (minXValue*-1) );
    	xBaseLine = x + paddingLeft + (minXValue*-1*xFactor);
    } else {
    	console.log( "No Negative X" );
    	xFactor = (chartWidth - paddingLeft - paddingRight)/( maxXValue );
    	xBaseLine = x + paddingLeft;
    }
    
    if( minYValue < 0 ) {
    	yFactor = (chartHeight - paddingBottom + paddingTop)/( maxYValue + (minYValue*-1) );
    	yBaseLine = y + chartHeight - paddingBottom + paddingTop*2 - (minYValue*-1*yFactor);
    } else {
    	yFactor = (chartHeight - paddingBottom - paddingTop)/( maxYValue );
    	yBaseLine = y + chartHeight - paddingBottom + paddingTop*2;
    }
    
    var yaxis = {
    	"x"      : xBaseLine,
    	"y"      : y + paddingTop,
    	"height" : chartHeight - paddingBottom + paddingTop
    };
    
    var xaxis = {
    	"x"     : x + paddingLeft,
    	"y"     : yBaseLine,
    	"width" : chartWidth - paddingLeft - paddingRight
    };
    
    console.log( "Axis: " , xaxis , yaxis );
    
    var lines = paper.set();
    var borders = paper.set();
    var labels = paper.set();
    var points = paper.set();
  
    
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
    
    if( options.labels ) {
    	
    	var xCounter = 0;
	    var xInterval = 1;
	    
	    if( maxXValue > 100 || minXValue < -100 ) {
	    	xInterval = 15;
	    } else if( maxXValue > 500 || minXValue < -500 ) {
	    	xInterval = 50;
	    } else if( maxXValue > 1000 || minXValue < -1000 ) {
	    	xInterval = 100;
	    } else {
	    	xInterval = 10;
	    }
	    
	    for( var i=(minXValue < 0) ? minXValue : 1, ii=maxXValue; i<=ii; i++ ) {
	    	
	    	if( i % xInterval == 0 ) {
	    			
	    		var path = [
	        	            "M" , xaxis.x + (xFactor*xCounter) , xaxis.y - 3,
	        	            "L" , xaxis.x + (xFactor*xCounter) , xaxis.y + 3
	        	            ];
	        	
	        	borders.push( paper.path( path.join(",") ) );
	        	
	    	}
	    	
	    	if( i % (xInterval*2) == 0 ) {
	    		labels.push( paper.text( xaxis.x + ( xFactor * xCounter) , xaxis.y + 10 , i ).attr( 'font' , options.labelFont ) );
	    	}
	    	
	    	xCounter++;
	    	
	    }
	    
	    var yCounter = 0;
	    var yInterval = 1;
	    
	    if( maxYValue > 100 || minYValue < -100 ) {
	    	yInterval = 15;
	    } else if( maxYValue > 500 || minYValue < -500 ) {
	    	yInterval = 50;
	    } else if( maxYValue > 1000 || minYValue < -1000 ) {
	    	yInterval = 100;
	    } else {
	    	yInterval = 10;
	    }
	    
	    for( var i=(minYValue < 0) ? minYValue : 1, ii=maxYValue; i<=ii; i++ ) {
	    	
	    	if( i % yInterval == 0 ) {
	    			
	    		var path = [
	        	            "M" , yaxis.x - 3 , yaxis.y + yaxis.height - (yFactor*yCounter),
	        	            "L" , yaxis.x + 3 , yaxis.y + yaxis.height - (yFactor*yCounter)
	        	            ];
	        	
	        	borders.push( paper.path( path.join(",") ) );
	        	
	    	}
	    	
	    	if( i % (yInterval*2) == 0 ) {
	    		labels.push( paper.text( yaxis.x - 25 , yaxis.y + yaxis.height - (yFactor * yCounter) , i ).attr( 'font' , options.labelFont ) );
	    	}
	    	
	    	yCounter++;
	    	
	    }
    	
    }
                                   
    for( var i=0, ii=values.length; i<ii; i++ ) {
    	
    	var path = [];
    	var stroke = [];
    	
    	for( var j=0, jj=values[i].length; j<jj; j++ ) {
    	
	    	var object = values[i][j];
	    	 
	    	var xValue = xaxis.x + object.x*xFactor;
	    	var yValue = xaxis.y - object.y*yFactor;
	    	
	    	if( j == 0 ) {
	    		path.push( "M" );
	    	} else {
	    		path.push( "L" );
	    	}
	    	
	    	var circle = paper.circle( xValue , yValue , 5 ).attr( 'fill' , 'black' );
	    	
	    	circle.charts = object;
	    
	    	path.push( xValue );
	    	path.push( yValue );
	    	
	    	points.push( circle );
    		
    		stroke = object.fill || options.fill || "blue";
	     
    	}
    	
    	 var el = paper.path( path.join(",") ).attr( "stroke" , stroke ).attr( "stroke-width" , 2 );
		
		if( Raphael.is( object , "object" ) ) {
			delete object.x;
			delete object.y;
			delete object.stroke;
			el.charts = object;
		}
		
		lines.push( el );
        
    }
    
    var result = paper.set();
    
    result.push( lines );
    result.push( borders );
    result.push( labels );
    result.push( points );

    result.lines = lines;
    result.borders = borders;
    result.labels = labels;
    result.points = points;
    
    return result;
    
};

Raphael.fn.linechart = function( x , y , width , height , values , options ) {
    return new LineChart( this , x , y , width , height , values , options  );
};
 
})( Raphael);