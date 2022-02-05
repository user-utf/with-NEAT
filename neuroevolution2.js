var Hevolution = function (options) {
    //potentialy inform weather we have it
    world: create(options.AF,options.population, options.layers,true);
    const layers = options.layers;
    self.setScore = (e,score) =>{
        world[e].value = score
    }
    self.run = (player,inputs) =>{
        const x = runNN(inputs,player,world,layers)
        world = x[1]
        return x[0]
    }

    self.mutate = (Perce,topx) =>{
        world = Mutation(Perce,topx,world)
    }
    return self


}
// var x = new Henrievolution({AF:'sigmoid',Pop:10,Layers:[3,4,5]})


Mutation = (Perce,topx,world) =>{
    var catigories = splitInputs(world,topx);
    var topInputs = catigories[0];
    for (var i = 2; i < topInputs.length;i++){
        for (var b = 1; b < topInputs[i].NN.length;b++){
            // var rand = Math.floor(Math.random() * 100);
            // if (rand <= Perce){
            //     topInputs[i] = addConnectionMutation(topInputs[i])
            // }
            for (var c = 0; c < topInputs[i].NN[b].length;c++){
                // var rand = Math.floor(Math.random() * 100);
                // if (rand <= Perce){
                //     addNodeMutation(topInputs[i].NN,b)
                // }

                var rand = Math.floor(Math.random() * 100);
                if (rand <= Perce){
                    topInputs[i].NN[b][c].biase = Math.random() * 2 -1
                }
            }
            for (var c = 0; c < topInputs[i].NN[b].length;c++){
                var rand = Math.floor(Math.random() * 100);
                if (rand <= Perce){
                    //mutate
                    // console.log(topInputs[i].NN[b][c])
                    for (var d = 0; d < topInputs[i].NN[b][c].weights.length;d++){
                        var rand = Math.floor(Math.random() * 100);
                        if (rand <= Perce){
                            topInputs[i].NN[b][c].weights[d].value = Math.random() * 2 -1
                        }
                            }
                        }
                    }
                    
                }
        }
    topInputs = topInputs.concat(catigories[1])
    world = topInputs
    return world
}
 
  unmatrixfy = (array) =>{
    var answer = [];
    for (var i = 0; i < array.length; i++){
        for (var b = 0; b < array[i].length; b++){
            answer.push(array[i][b])
        }
    }
    return answer;
}

let inovationNumber = 0;
let neuronInovationNumber = 0;
create = (activation,activeCount,layers,k) =>{
    world = []
    for (var n = 0; n < activeCount; n++){
    //creating the NNs
    world.push({NN:[],value:0,topIno:0})
    inovationNumber = 0;
    neuronInovationNumber = 0;
        for (var l = 0; l < layers.length; l++){
            makeNN(n,l,activation,layers,k)
        }
    }
    return world
}
makeNN = (n,l,activ,layers,k) =>{

    var set1 = [];
    if (l > 0){
    for (var node = 0; node < layers[l];node++){
        set1.push({value:0,biase:0,inovationNumber:neuronInovationNumber,activation:activ,weights:[]})
        neuronInovationNumber += 1
        if (k){
        // set1 = [{value:0,biase:0,inovationNumber:neuronInovationNumber,activation:activ,weights:[]}]
        for (var node0 = 0; node0 < layers[l-1];node0++){
            // set1[node].weights.push([])
            // console.log(set1,node0)
            set1 = makeGiven(set1,node,node0,l,-1)
        }
    }
    }
    }else{
        for (var node = 0; node < layers[l];node++){
            set1.push({value:0,inovationNumber:neuronInovationNumber})
            neuronInovationNumber += 1
        }
    }
    world[n].topIno = {weight:inovationNumber,neuron:neuronInovationNumber}
    world[n].NN.splice(l,0,set1)
    // console.log(world);
    return world
}
runNN = (inputs,n,world,layers) =>{
    world = run1(inputs,n,world)
    return [fill(n,layers),world];
}
run1 = (inputs,n,world) =>{
    for (var i = 0; i < world[n].NN[0].length; i++){
        world[n].NN[0][i].value = inputs[i]
    }
    return world
}
activate = (n,layer,neurons) =>{
    var add = 0
    for (var b = 0; b < world[n].NN[layer][neurons].weights.length;b++){
        const wei = world[n].NN[layer][neurons].weights[b]
        add += (world[n].NN[wei.layer][wei.neuron].value * wei.value)
    }
    // console.log(world[i].NN[i2].neurons[i3])
    add +=  world[n].NN[layer][neurons].biase
    let afterActive;
    switch(world[n].NN[layer][neurons].activation) {
        case  "sigmoid":
            afterActive = sigmoid(add);
            break;
        case  "BSF":
            afterActive = BSF(add);
            break;
        case  "Relu":
            afterActive = Relu(add);
            break;
        case  "LRelu":
            afterActive = LRelu(add);
            break;
        case  "Tanh":
            afterActive = Tanh(add);
    }
    world[n].NN[layer][neurons].value = afterActive
    // console.log(world[i].NN[i2].neurons[i3],add)
}
fill = (n,layers) =>{
    for (var n2 = 1; n2 < world[n].NN.length; n2++){
        // console.log(world[n].NN[n2])
        for (var n3 = 0; n3 < world[n].NN[n2].length; n3++){
            // console.log(world[n].NN[n2])
            activate(n,n2,n3);
            if (n2 == world[n].NN.length-1 && n3 == world[n].NN[n2].length-1){
                let ans = []
                for (var i = 0; i < layers[layers.length-1];i++){
                    ans.push(world[n].NN[n2][n3-i].value)
                }
                return ans
                }
            }
        }
}
function sigmoid(t) {
    return 1/(1+Math.pow(Math.E, -t));
}

function BSF (x){
    if (x<0){
        return 0
    }else{
        return 1
    }
}

function Relu(x){
    if (x<0){
        return 0
    }else{
        return x
    }
}
function LRelu(x){
    if (x<0){
        return 0.01*x
    }else{
        return x
    }
}
function Tanh(x){
    return (2*sigmoid(2*x)-1)
}

// function ELU(){

// }

function makeGiven(set1,node,node0,l,n){
    set1[node].weights.push({value:0,layer:l+n,neuron:node0,inovationNumber:inovationNumber})
    inovationNumber += 1
    return set1
}
function splitInputs(originalList,chosenPer){
    const sortedList = sortInputsByVal(originalList)
    const limit = Math.floor(sortedList.length * chosenPer /100);
    return [sortedList.slice(0,limit),sortedList.slice(limit)];
}
function sortInputsByVal(originalList){
    const list = originalList
    const len = list.length
    for (let i = 0; i < len; i++) {
      let min = i
      for (let j = i + 1; j < len; j++) {
        if (list[min].value > list[j].value) {
          min = j
        }
      }
      if (min !== i) {
        // a new minimum is found. Swap that with the current element
        ;[list[i], list[min]] = [list[min], list[i]]
      }
    }
    let list2 = []
    for (var i = list.length-1; i >= 0;i--){
        list2.push(list[i])
    }
    return list2
}
