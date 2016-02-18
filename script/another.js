var width=500,
    height=480;

////var plot = d3.select("#plot")
////    .append("div")
////    .attr("class", "chart")
////    .style("width", width + "px")
////    .style("height", height + "px")
////    .append("svg")
////    .attr("width", width)
////    .attr("height", height);
//
//var margin = {t:0,r:0,b:0,l:0};
////var width = document.getElementById('plot').clientWidth - margin.r - margin.l,
////    height = document.getElementById('plot').clientHeight - margin.t - margin.b;
////var width=1000,
////    height=600;

var plot = d3.select('#plot')
    .append('svg')
    .attr('width',width)
    .attr('height',height)
    .append('g')
    .attr('class','plot');
    //.attr('transform','translate('+margin.l+','+margin.t+')');
//var canvas=d3.select('.canvas')
//
var plot2=d3.select('#plot2')
    .append('svg')
    .attr('width',width)
    .attr('height',height)
    .append('g')
    //.attr('transform',"translate")
    .attr('class','plot2');

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([0, height]);


var partition = d3.layout.partition()
    .children(function(d){
        return d.values;})
    .value(function(d) { return d.number; });

//var partition2 = d3.layout.partition()
//    .children(function(d){
//        return d.values;})
//    .value(function(d) { return d.number; });

var color = d3.scale.category20b();

queue()
    .defer(d3.csv,'data/Table2.csv',parse)
    .defer(d3.csv,'data/Table2.csv',parse)
    .await(dataLoaded);
//dataLoaded
function dataLoaded(err,Table1,Table2) {
  draw1(Table1)
  draw2(Table2)

}

//country distrubution
function draw1(Table1) {
    //var x = d3.scale.linear()
    //    .range([0, width]);
    //
    //var y = d3.scale.linear()
    //    .range([0, height]);

    var nestedData=d3.nest()
        .key(function(d){return d.states})
        .key(function(d){return d.town})
        .entries(Table1)
        .sort(function(a,b){
            return a.value - b.value; //sort by top-level activities
        });

    console.log('nestedData', nestedData);

    var hierarchy = {
        key: "United States",
        Key:'town',
        values: nestedData
    };

    console.log('hierarchy',hierarchy)

//draw the group and add its position values
    var group=plot.selectAll('plot1')
        .data(partition(hierarchy))
        .enter()
        .append("g")
        .attr('transform',function(d){ return "translate("  +x(d.y) + "," + y(d.x) + ")"})
        .on('click',click1);

    var kx = width/hierarchy.dx,
        ky = height/1;

    group
        .append('rect')
        .attr()
        .attr("width", hierarchy.dy*kx)
        .attr("fill", function(d) { return color((d.children ? d : d.parent).key); })
        .attr('stroke',"lightgrey")
        .attr('stroke-width','0.1')
        .attr("height", function(d) { return d.dx*ky});

    //append the value
    var value=group
        .append("text")
        //.attr('class',"text1")
        .attr("dy",".35em")
        //.attr("transform", transform1)
        .attr('transform',function(d){return "translate(100," + d.dx * ky/2 + ")";})//control the original
        .text(function(d){return d.value})
        .style("opacity", function(d) { return d.dx * ky > 12 ? 1 : 0; });

    ////append key
    var key=group
        .append("text")
        //.attr('class','text2')
        .attr("dy",".35em")
        .attr("transform",function(d){return "translate(5," + d.dx * ky/2 + ")";} )
        .text(function(d) {return d.key;})
        .style("opacity", function(d) { return d.dx * ky > 12 ? 1 : 0; });


    ////append type
    var type=group
        .append("text")
        //.attr('class','text3')
        .attr("dy",".35em")
        //.attr("transform", transform1)
        .attr("transform",function(d){return "translate(10," + d.dx * ky/2 + ")";} )
        .text(function(d) {return d.type})
        .style("opacity", function(d) { return d.dx * ky > 12 ? 1 : 0; });



    //d3.select(window)
    //    .on("click", function() { click1(hierarchy); });

    function click1(d) {
        //if (!d.children) return;
        console.log(d3.select(this).data());

        kx = (d.y ? width - 40 : width) / (1 - d.y);
        ky = height / d.dx;
        x.domain([d.y, 1]).range([d.y ? 40 : 0, width]);
        y.domain([d.x, d.x + d.dx]);

        var t = group.transition()
            .duration(d3.event.altKey ? 7500 : 750)
            //.duration(750)
            .attr("transform", function(d) { return "translate(" + x(d.y) + "," + y(d.x) + ")"; });

        t.select("rect")
            .attr("width", d.dy * kx)
            .attr("height", function(d) { return d.dx * ky; });


        key.transition()
            .duration(750)
            .attr("transform", function(d){return "translate(10," + d.dx * ky/2 + ")";})
            .style("opacity", function(d) { return d.dx * ky > 12 ? 1 : 0; });

        type.transition()
            .duration(750)
            .attr("transform", function(d){return "translate(10," + d.dx * ky/2 + ")";})
            .style("opacity", function(d) { return d.dx * ky > 12 ? 1 : 0; });

        value.transition()
            .duration(750)
            .attr("transform", function(d){return "translate(120," + d.dx * ky/2 + ")";})
            .style("opacity", function(d) { return d.dx * ky > 12 ? 1 : 0; });


        d3.event.stopPropagation();
    }
}


//type distribution
function draw2(Table2) {
    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([0, height]);

    var nestedData2=d3.nest()
        .key(function(d){return d.type})
        .key(function(d){return d.states})
        .entries(Table2)
        .sort(function(a,b){
            return a.value - b.value; //sort by top-level activities
        });



    console.log('nestedData2', nestedData2);
    var hierarchy2 = {
        key: "Total Hate Cimes",
        values: nestedData2
    };

    console.log('hierarchy',hierarchy2)

//draw the group and add its position values
    var group1=plot2.selectAll('plot2')
        .data(partition(hierarchy2))
        .enter()
        .append("g")
        .attr('transform',function(d){ return "translate("  +x(d.y) + "," + y(d.x) + ")"})
        .on('click',click);

    var kx1 = width/hierarchy2.dx,
        ky1 = height/1;

    group1
        .append('rect')
        .attr()
        .attr("width", hierarchy2.dy*kx1)
        .attr("fill", function(d) { return color((d.children ? d : d.parent).key); })
        //.attr("fill",function(d){return color(d.type)})
        .attr('stroke',"lightgrey")
        .attr('stroke-width','0.2')
        .attr("height", function(d) { return d.dx*ky1});

    //append the value
    var value1=group1
        .append("text")
        //.attr('class',"text1")
        .attr("dy",".35em")
        //.attr("transform", transform1)
        .attr('transform',function(d){return "translate(100," + d.dx * ky1/2 + ")";})//control the original
        .text(function(d){return d.value})
        .style("opacity", function(d) { return d.dx * ky1 > 12 ? 1 : 0; });

    ////append key
    var key1=group1
        .append("text")
        //.attr('class','text1')
        .attr("dy",".35em")
        .attr("transform",function(d){return "translate(10," + d.dx * ky1/2 + ")";} )
        .text(function(d) {return d.key;})
        .style("opacity", function(d) { return d.dx * ky1 > 12 ? 1 : 0; });


    ////append type
    var town1=group1
        .append("text")
        //.attr('class','text3')
        .attr("dy",".35em")
        //.attr("transform", transform1)
        .attr("transform",function(d){return "translate(20," + d.dx * ky1/2 + ")";} )
        .text(function(d) {return d.town})
        .style("opacity", function(d) { return d.dx * ky1 > 12 ? 1 : 0; });



    d3.select(window)
        .on("click", function() { click(hierarchy2); });

    function click(d) {
        //if (!d.children) return;
        console.log(d3.select(this).data());

        kx1 = (d.y ? width - 40 : width) / (1 - d.y);
        ky1 = height / d.dx;
        x.domain([d.y, 1]).range([d.y ? 40 : 0, width]);
        y.domain([d.x, d.x + d.dx]);

        var t1 = group1.transition()
            .duration(d3.event.altKey ? 7500 : 750)
            //.duration(750)
            .attr("transform", function(d) { return "translate(" + x(d.y) + "," + y(d.x) + ")"; });

        t1
            .select("rect")
            .attr("width", d.dy * kx1)
            .attr("height", function(d) { return d.dx * ky1; });


        key1.transition()
            .duration(750)
            .attr("transform", function(d){return "translate(20," + d.dx * ky1/2 + ")";})
            .style("opacity", function(d) { return d.dx * ky1 > 12 ? 1 : 0; });

        town1.transition()
            .duration(750)
            .attr("transform", function(d){return "translate(20," + d.dx * ky1/2 + ")";})
            .style("opacity", function(d) { return d.dx * ky1 > 12 ? 1 : 0; });

        value1.transition()
            .duration(750)
            .attr("transform", function(d){return "translate(100," + d.dx * ky1/2 + ")";})
            .style("opacity", function(d) { return d.dx * ky1 > 12 ? 1 : 0; });

        d3.event.stopPropagation();
    }
}







function parse(d){
    return {
        states: d['State'],
        town: d['Town'],
        number:+d.Crimes,
        type: d.Type

    };

}

