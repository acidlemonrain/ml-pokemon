<template>

    <div>

        <small> 战斗力 & <strong>HP</strong> (当{{pro}}={{v}})  </small>
        <div :id=id>

        </div>


    </div>

</template>

<script>
    import  {data} from "../data";
    import * as d3 from 'd3'
    import regression from 'regression';
    export default {
        props:['pro','v','id'],
        data() {
            return {
                dataset: [ ],
            }
        },
        mounted() {
            var pro = this.pro.trim()
            var v = this.v
            var id = this.id

            this.dataset = data.filter(d=> d[pro] == v)
            this.dataset = this.dataset.slice(Math.floor(this.dataset.length*0.3))
            var height = 300
            var width = 300
            var padding = 30
            var svg =  d3.select('#'+id).append('svg')
                .attr('width',width)
                .attr('height',height)

            //图坐标
            var xScale = d3.scaleLinear().domain([0,1.2*d3.max(this.dataset,function (d) {
                return +d.hp
            })]).range([0,width-padding*2])

            var yScale = d3.scaleLinear().domain([0,1.2*d3.max(this.dataset,function (d) {
                return +d.cp
            })]).range([height-padding*2,0])



            var circle = svg.selectAll('circle')
                .data(this.dataset)
                .enter()
                .append('circle')
                .attr('fill','rgba(200, 20, 200, 0.88)')
                .attr('stroke','black')
                .attr('cx',(d)=> xScale(+d.hp)+padding)
                .attr('cy',(d)=> yScale(+d.cp)+padding)
                .attr('r',5)



            //坐标轴

            var yaxis = d3.axisLeft().scale(yScale)
            svg.append('g')
                .attr('transform','translate('+(padding)+','+padding+')')
                .call(yaxis)

            var xaxis = d3.axisBottom().scale(xScale)
            svg.append('g')
                .attr('transform','translate('+padding+','+(height-padding)+')')
                .call(xaxis)



            var xdata = this.dataset.map(d=>+d.hp)
            var ydata = this.dataset.map(d=>+d.cp)

            var line_sc = []

            for(let i =0; i<xdata.length;i++){

                line_sc.push( [xdata[i],ydata[i]] )

            }
            const result = regression.linear(line_sc);
            const gradient = result.equation[0];
            const yIntercept = result.equation[1];

            const double = regression.polynomial(line_sc,{order:2});

            this.$emit('model',{
                model:{gradient:gradient,yIntercept:yIntercept,double:double},
                name:pro,
                value:v
            })


            var y_zero =  yIntercept
            var y_full =  500*gradient + yIntercept

            var dotA = [xScale(0)+padding,yScale(y_zero)+padding]
            var dotB = [xScale(500)+padding,yScale(y_full)+padding]

            var line = [dotA,dotB]
            var linePath = d3.line()
            svg.append('path')
                .attr('d',linePath(line))
                .attr('stroke','black')
                .attr('stroke-width','4px')
                .attr('fill','none')


        }
    }
</script>

<style scoped>
    svg{
        background-color: lightsteelblue;
    }
    circle{
        stroke-width: 6px;
        fill: rgba(176, 196, 222, 0.28);
        stroke: black;
    }
</style>
