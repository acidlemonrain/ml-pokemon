<template>
  <div id="app">
    <h1>人工智能之宝可梦分析</h1>

    <p>
      模型分析集合：
      {{ana_data.length}}
      测试集合:
      {{test_data.length}}
    </p>

    <button @click="ml_begin(1)">开始测试(利用一次方程)</button>
    <button @click="ml_begin(2)">开始测试(利用二次方程)</button>
    <div>
      <div>
        <span class="xx">测试结果</span>
        <span class="xx">原始数据</span>
        <span class="xx">吻合率</span>
      </div>
      <div v-for="r in results">
        <span class="x">{{r.test_cp}}</span>
        <span class="x">{{r.pri_cp}}</span>
        <span class="x">{{r.like}}</span>
      </div>
    </div>

    <div>
      <button @click="ana = !ana">查看方程</button>
      <h2>
        函数分析
      </h2>
      <div>

        <div v-for="model in math_model" v-if="ana">
          <p style="text-align: left;font-weight: bolder">种类 {{model.name}}不一样时 , cp-hp函数关系式 </p>


           <tr>
             <th v-for="(ele,name) in model.models">{{name}}</th>
           </tr>
           <tr>
             <td v-for="(ele,name) in model.models">
                <p>一次： y={{ele.gradient}}x+{{ele.yIntercept}}</p>
                <p>二次： {{ele.double.string}}  </p>
             </td>
           </tr>


        </div>
      </div>
    </div>

    <fieldset>
      <legend>
        <h4>一个宝可梦拥有的属性如下</h4>
      </legend>
      <div>
        <span v-for="p in pros" v-show="fil(p)">
          {{ p }}
        </span>
      </div>
    </fieldset>
    <button @click="xx = !xx">changemode</button>

    <div
      v-show="!xx"
      style="display: flex;flex-wrap: wrap;justify-content: space-around"
    >
      <div v-for="p in pros" v-if="fil(p)">
        <chart :pro="p"></chart>
      </div>
    </div>

    <div v-show="xx">
      <div
        v-for="sw in sws"
        style="background-color: rgba(176,196,222,0.48);margin-bottom: 100px;padding: 10px"
      >
        <h1>{{ sw.name }}</h1>
        <div
          style="display: flex;flex-wrap: wrap;justify-content: space-around"
        >
          <div v-for="v in sw.value">
            <hpChart @model="handle_model" :pro="sw.name" :id="sw.name + v" :v="v"></hpChart>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import chart from "./components/chart";
import * as d3 from 'd3'
import { data } from "./data";
import hpChart from "./components/hpChart";

export default {
  name: "app",
  components: {
    chart,
    hpChart
  },
  data() {
    return {
      xx: false,
      ana:false,
      dataset: [],
      results:[],
      ui:0,
      pros: [],
      test_data:[],
      ana_data:[],
      sws: [
        {
          name: "species",
          value: []
        },
        {
          name: "power_up_stardust",
          value: []
        },
        {
          name: "power_up_candy",
          value: []
        },
        {
          name: "attack_weak_value",
          value: []
        },
        {
          name: "attack_strong_value",
          value: []
        }
      ],
      math_model:[
        {
          name: "species",
          models:{}
        },
        {
          name: "power_up_stardust",
          models:{}
        },
        {
          name: "power_up_candy",
          models:{}
        },
        {
          name: "attack_weak_value",
          models:{}
        },
        {
          name: "attack_strong_value",
          models:{}
        }
      ]
    };
  },
  methods: {
    ml_begin(exp){
    this.results = []
     this.test_data.forEach(pokemon=>{


       var resluts_value = []
       //遍历模型
       for(let i =0 ;i<this.math_model.length;i++){
         var model = this.math_model[i].models[pokemon[this.math_model[i].name]]
         var cp = 0
         if(exp ==1){
           //一次方程
           cp= (pokemon.hp*model.gradient) + model.yIntercept;
         }else{
           //二次方程
            var es = model.double.equation
            cp= es[0]*Math.pow(pokemon.hp,2) +es[1]*pokemon.hp+es[2]
         }

          resluts_value.push(cp)
       }
       //整合所有函数结果
       var test_cp = d3.mean(resluts_value)
       var delta = Math.abs(test_cp-pokemon.cp)
       var pecence = (1-delta/pokemon.cp)*100

       var re = {
         pri_cp:pokemon.cp,
         test_cp:test_cp,
         like:pecence
       }

       this.results.push(re)



     })

      alert('一共测试了'+this.test_data.length+'个数据，平均吻合率是：'+d3.mean(this.results,d=>d.like)+'%')

    },
    handle_model(event){
      var typename = event.name
      var _index = this.math_model.map(ele=>ele.name).indexOf(typename)

      var target_model = this.math_model[_index]
      var models = target_model.models
      models[event.value] = event.model


      this.ui++
    },
    fill_value() {
      this.sws.forEach(ele => {
        //
        var values = data.map(d => d[ele.name]);
        var key = new Set(values);
        key.forEach(e => {
          ele.value.push(e);
        });
        ele.value.sort()

      });
    },
    fil(p) {
      let x = [
        "name",
        "attack_weak",
        "attack_strong",
        "attack_weak_type",
        "attack_strong_type",
              'notes'
      ];
      if (x.includes(p) || p.substr(p.length - 4) == "_new") {
        return false;
      } else {
        return true;
      }
    }
  },
  created() {
    for (let item in data[0]) {
      this.pros.push(item);
    }
    this.fill_value();
    this.test_data = data.slice(0,Math.floor(data.length*0.3))
    this.ana_data = data.slice(Math.floor(data.length*0.3))
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
span {
  padding: 2px;
  background-color: lightpink;
  margin: 4px 10px;
  display: inline-block;
}
fieldset {
  max-width: 600px;
  margin: auto;
}
table {
  border-collapse: collapse;
  margin: auto;
}

table, th, td {
  border: 1px solid black;
  padding: 10px;
}
  .x{
    width: 200px;
    border: 1px solid black;
  }
.xx{
  width: 200px;
  border: 1px solid black;
  background-color: #ff541d;
}
</style>
