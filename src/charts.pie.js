(function( Raphael , undefined  ){ 

	var PieChart = function( paper , x , y , chartWidth , chartHeight , values , options ) {
	
		Raphael.getColor.reset();
		
		options = options || {};
		options.title = options.title || null;
		
		var slices = paper.set();
		var labels = paper.set();
		
		var paddingTop = options.paddingTop = options.paddingTop || 20;
		var paddingBottom = options.paddingBottom = options.paddingBottom || 10;
		var paddingLeft = options.paddingLeft = options.paddingLeft || 10;
		var paddingRight = options.paddingRight = options.paddingRight || 10;
		
		var centerX = x + options.paddingLeft + chartWidth/2;
		var centerY = y + options.paddingTop + chartHeight/2;
		var radius = Math.min( chartHeight-options.paddingTop-options.paddingBottom , chartWidth-options.paddingLeft-options.paddingRight )/2.5;
		
		if( options.title ) {
			paper.text( centerX , y + 20 , options.title ).attr({
				"font" : "15px sans-serif",
				"text-anchor" : "middle"
			});
		}
		
		var totalValue = 0;
		
		for( var i=0, ii=values.length; i<ii; i++ ) {
			if( Raphael.is( values[i] , "object" ) ) {
				totalValue += parseFloat(values[i].value);
			} else {
				totalValue += parseFloat(values[i]);
			}
		}
		
		var lastAngle = 360;
		
		for( var i=0, ii=values.length; i<ii; i++ ) {
			
			var value;
			var object;
			
			if( Raphael.is( values[i] , "object" ) ) {
				value = values[i].value;
				object = values[i];
			} else {
				value = values[i];
				object = {};
			}
			
			var percentage = value/totalValue;
			var angle = 360 * percentage;
			var startAngle = lastAngle;
			var endAngle = lastAngle-angle;
			
			lastAngle -= angle;
			
			var rad = Math.PI / 180;
            var x1 = centerX + radius * Math.cos(-startAngle * rad);
            var x2 = centerX + radius * Math.cos(-endAngle * rad);
            var xm = centerX + radius / 2 * Math.cos(-(startAngle + (endAngle - startAngle) / 2) * rad);
            var y1 = centerY + radius * Math.sin(-startAngle * rad);
            var y2 = centerY + radius * Math.sin(-endAngle * rad);
            var ym = centerY + radius / 2 * Math.sin(-(startAngle + (endAngle - startAngle) / 2) * rad);
            var path = [
                "M", centerX, centerY,
                "L", x1, y1,
                "A", radius, radius, 0, +(Math.abs(endAngle - startAngle) > 180), 1, x2, y2,
                "z"
            ];
            
            var slice = paper.path( path ).attr({
            	"fill" : Raphael.getColor()
            });
            
            slices.push( slice );
            
            if( options.labels ) {
            	
            	slice.label = paper.text( xm , ym , object.name );
            	
            	labels.push( slice.label );
            	
            }
            
            slice.value = value;
            
            slices.push( slice );
			
		}
		
		slices.mouseover(function(){
			
			this.toFront().animate({ "transform" : "s1.10" } , 300 );
			this.label.toFront().animate({ "transform" : "s1.25" } , 300 );
			
		}).mouseout(function(){
			
			this.animate({ "transform" : "s1" } , 300 );
			this.label.animate({ "transform" : "s1" } , 300 );
			
		});
		
		var result = paper.set();
        
        result.push( slices );
        result.slices = slices;
        result.slices.toFront();
        
        result.push( labels );
        result.labels = labels;
        result.labels.toFront();
        
        return result;
	
	};
	
	var ctor = function() {};
	ctor.prototype = Raphael.g;
	PieChart.prototype = new ctor;

	Raphael.fn.piechart = function( x , y , width , height , values , options ) {
	    return new PieChart( this , x , y , width , height , values , options  );
	};

})( Raphael );