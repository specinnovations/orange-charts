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
    var paddingLeft = (options.labels) ? 75 : 5;
    var paddingRight = 5;
    
    var gutterWidth = 5;
    var barWidth = (chartWidth - paddingLeft - paddingRight)/barValues.length - gutterWidth;
    var factor = chartHeight/( Math.max.apply( Math , barValues ) + paddingTop + paddingBottom );
    var barBaseLine = paper.height - paddingBottom;
    
    console.log( "Bar Width: " , barWidth );
    console.log( "Factor: " , factor );
    
    var bars = [];
    var borders = [];
    var labels = [];
                                   
    for( var i=0, ii=barValues.length; i<ii; i++ ) {
        
        var value = barValues[i];
        
        var height = value * factor;
        var x = paddingLeft + (bars.length * (barWidth + gutterWidth));
        var y = barBaseLine - height;
        
        console.log( "Bar: " , x , y , height );
        
        var el = paper.rect( x , y , barWidth , height );
        
        bars.push( el );
        
    }
    
    return [ bars , borders, labels ];
    
};

Raphael.fn.columnChart = function( x , y , width , height , values , options ) {
    return new ColumnChart( this , x , y , width , height , values , options  );
};
 
})( Raphael);