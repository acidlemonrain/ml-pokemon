<template>

      <div>
          <p> CP_NEW  和 <strong>{{pro}}</strong> 的关系 </p>

          <div :id=pro>

          </div>

      </div>

</template>

<script>
    import  {data} from "../data";
    import * as d3 from 'd3'
    export default {
        props:['pro'],
        name: "chart",
        data() {
            return {
                dataset: [ ],
            }
        },
        mounted() {
            this.dataset = data
            var pro = this.pro
            var height = 400
            var width = 500
            var padding = 30
            var svg =  d3.select('#'+pro).append('svg')
                .attr('width',width)
                .attr('height',height)

            //图坐标
            var xScale = d3.scaleLinear().domain([0,1.2*d3.max(this.dataset,function (d) {
                return +d[pro]
            })]).range([0,width-padding*2])


            if( pro == 'species'){
                xScale = d3.scaleLinear().domain([0,1.2*4]).range([0,width-padding*2])
                var species_table = {
                    Caterpie:1,
                    Eevee:2,
                    Pidgey:3,
                    Weedle:4,
                    1:'Caterpie',
                    2:'Eevee',
                    3:'Pidgey',
                    4:'Weedle'
                }

            }


            var yScale = d3.scaleLinear().domain([0,1.2*d3.max(this.dataset,function (d) {
                return +d.cp_new
            })]).range([height-padding*2,0])



            var circle = svg.selectAll('circle')
                .data(this.dataset)
                .enter()
                .append('circle')
                .attr('fill','black')
                .attr('cx',(d)=>{
                    if(pro == 'species'){
                        return  xScale(species_table[d[pro]])+padding
                    }else{
                        return  xScale(+d[pro])+padding
                    }

                })
                .attr('cy',(d)=> yScale(+d.cp_new)+padding)
                .attr('r',5)



            //坐标轴

            var yaxis = d3.axisLeft().scale(yScale)
            svg.append('g')
                .attr('transform','translate('+(padding)+','+padding+')')
                .call(yaxis)

            var xaxis = d3.axisBottom().scale(xScale)
            if(pro =='species'){
                xaxis.tickFormat(d=>species_table[d]).tickSize(4)
            }
               svg.append('g')
                .attr('transform','translate('+padding+','+(height-padding)+')')
               .call(xaxis)




        }
    }
</script>

<style scoped>
svg{
    background-color: lightsteelblue;
}
</style>
