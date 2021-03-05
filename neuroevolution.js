var activ1 = '';
var Henrievolution = function (options) {
    //potentialy inform weather we have it
    world: create(options.AF,options.population, options.layers,options.NEAT);
    const layers = options.layers;
    const neatOn = options.NEAT
    activ1 = options.AF
    self.setScore = (e,score) =>{
        world[e].value = score
    }
    self.run = (player,inputs) =>{
        const x = runNN(inputs,player,world,layers)
        world = x[1]
        return x[0]
    }

    self.mutate = (Perce,topx) =>{
        world = Mutation(Perce,topx,world,neatOn)
    }
    return self


}
// var x = new Henrievolution({AF:'sigmoid',Pop:10,Layers:[3,4,5]})


Mutation = (Perce,topx,world,neatOn) =>{

    if (neatOn){
        world = NEAT(world,Perce,topx)
    }else{
        var catigories = splitInputs(world,topx);
        var topInputs = catigories[0]
        topInputs = setMutation(topInputs,Perce)
        topInputs = topInputs.concat(catigories[1])
        world = topInputs
    }

    //put them back with the mere mortals
    return world
}
addNeuronMutation = (topInputs) =>{
    if (Math.random() < 0.2){
        for (var i = 2; i < topInputs.length;i++){
            if (topInputs[i].NN.length == 2){
                topInputs[i].NN.splice(1, 0, [{value:0,biase:0,inovationNumber:nInovationNumber(1,0,topInputs[i].topIno.neuron),activation:activ1,weights:[]}]);
                topInputs = fix(1,topInputs,i)
            }else{
                if (Math.random() > 0.2){
                    let layer = Math.floor(Math.random() * (topInputs[i].NN.length-1))+1
                    //this if is torprevent new output neurons, something might be wrong with my implementation of math.random
                    if (layer < topInputs[i].NN.length-1 && layer != 0){
                        topInputs[i].NN[layer].push({value:0,biase:0,inovationNumber:nInovationNumber(layer,topInputs[i].NN[layer].length,topInputs[i].topIno.neuron),activation:activ1,weights:[]});
                    }
                    }else{

                    let layer = Math.floor(Math.random() * (topInputs[i].NN.length-1))+1
                    topInputs[i].NN.splice(layer, 0, [{value:0,biase:0,inovationNumber:nInovationNumber(layer,topInputs[i].NN[layer].length,topInputs[i].topIno.neuron),activation:activ1,weights:[]}]);
                    topInputs = fix(layer,topInputs,i)
                }
            }
        }
    }
    return topInputs
}
fix = (layer,topInputs,i) =>{
        for (var b = 1; b < topInputs[i].NN.length;b++){
            for (var c = 0; c < topInputs[i].NN[b].length;c++){
                for (var d = 0; d < topInputs[i].NN[b][c].weights.length;d++){
                    if (topInputs[i].NN[b][c].weights[d].layer >= layer){
                        topInputs[i].NN[b][c].weights[d].layer += 1
                        // console.log(topInputs[i].NN[b][c].weights[d].layer,i)
                    }
            }
            }
        }
    return topInputs
}
addConnectionMutation = (topInputs,Perce) =>{
    for (var i = 2; i < topInputs.length;i++){
        for (var b = 1; b < topInputs[i].NN.length;b++){
            var rand = Math.floor(Math.random() * 100);
            if (rand <= Perce){
                const Lspot = Math.floor(Math.random() * (topInputs[i].NN.length))
                const Nspot = Math.floor(Math.random() * topInputs[i].NN[Lspot].length)
                const z = Math.floor(Math.random() *(topInputs[i].NN[b].length))
                const spot = topInputs[i].NN[b]
                //checking for repeats
                var ans = false
                spot[z].weights.forEach(weight =>{if (weight.layer == Lspot && weight.neuron == Nspot){ans = true}})
                if (ans == false && b != Lspot < b){
                    spot[z].weights.push({value:0,layer:Lspot,neuron:Nspot,inovationNumber:wInovation(spot[z].inovationNumber,topInputs[i].NN[Lspot][Nspot].inovationNumber)})
                }
                }
        }
    }
    return topInputs
}
changeMutation =(topInputs,Perce) =>{
    for (var i = 2; i < topInputs.length;i++){
        for (var b = 1; b < topInputs[i].NN.length;b++){
            for (var c = 0; c < topInputs[i].NN[b].length;c++){
                var rand = Math.floor(Math.random() * 100);
                if (rand <= Perce){
                    topInputs[i].NN[b][c].biase += Math.random() * 1.2 -0.2
                }
            }
            for (var c = 0; c < topInputs[i].NN[b].length;c++){
                var rand = Math.floor(Math.random() * 100);
                if (rand <= Perce){
                    //mutate
                    for (var d = 0; d < topInputs[i].NN[b][c].weights.length;d++){
                        var rand = Math.floor(Math.random() * 100);
                        if (rand <= Perce){
                            topInputs[i].NN[b][c].weights[d].value += Math.random() * 1.2 -0.2
                        }
                    }
                        }
                    }
                    
                }
        }
    return topInputs  
}
setMutation =(topInputs,Perce) =>{
    for (var i = 2; i < topInputs.length;i++){
        for (var b = 1; b < topInputs[i].NN.length;b++){
            for (var c = 0; c < topInputs[i].NN[b].length;c++){
                var rand = Math.floor(Math.random() * 100);
                if (rand <= Perce){
                    topInputs[i].NN[b][c].biase = Math.random() * 2 -1
                }
            }
            for (var c = 0; c < topInputs[i].NN[b].length;c++){
                var rand = Math.floor(Math.random() * 100);
                if (rand <= Perce){
                    //mutate
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
    return topInputs
}
var wMoves = []
wInovation =(currentIn,newIn)=>{
    if (wMoves.length == 0){
        wMoves.push([currentIn,newIn,wMoves.length])
        return wMoves.length-1
    }else{
        wMoves2 = wMoves
        var buffer = true
        for (var i = 0; i < wMoves2.length;i++){
            if (currentIn == wMoves2[i][0] && newIn == wMoves2[i][1]){
                return wMoves2[i][2]
            }else{
                buffer = false
            }
        }
        //could be a cause of error, further investigation is needed
        if (buffer == false){
            wMoves.push([currentIn,newIn,wMoves.length])
        }
        wMoves = wMoves2
        return wMoves.length-1
    }
}
var nSpots = []
nInovationNumber = (layer,neuron,top) =>{
    if (nSpots.length == 0){
        nSpots.push([layer,neuron,nSpots.length + top])
        return nSpots.length-1 + top
    }else{
        nSpots2 = nSpots
        var buffer = true
        for (var i = 0; i < nSpots2.length;i++){
            if (layer == nSpots2[i][0] && neuron == nSpots2[i][1]){
                return nSpots2[i][2]
            }else{
                buffer = false
            }
        }
        //could be a cause of error, further investigation is needed
        if (buffer == false){
            nSpots2.push([layer,neuron,nSpots.length + top])
        }
        nSpots = nSpots2
        return nSpots2.length-1 + top
    }    
}
NEAT =(world,Perce,topx)=>{
    // var species = speciate(world,5)
    var species = [world]
    var ans = []
    for (var i = 0; i < species.length;i++){
        element = species[i]
        // element = crossover(element,2)
        //2 as in kill 1/2
        var catigories = splitInputs(element,(topx/world.length)*element.length);
        var topInputs = catigories[0];
        //different mutations
        var rand = Math.floor(Math.random() * 5);
        switch (rand){
            case 0:
                //0 == set weights to random numbers from -1,1
                topInputs = setMutation(topInputs,Perce)
                break;
            case 1:
                //1 == change weights by micro amounts, make sure it's > -1 < 1
                topInputs = changeMutation(topInputs,Perce)
                break;
            case 2:
                // //2 == add conection and give/check for inovation number
                topInputs = addConnectionMutation(topInputs,Perce)
                break;
            case 3:
                // 3 add neuron mutation give it mutation number and chop the connection in two, give one a weight of 1
                topInputs = addNeuronMutation(topInputs,Perce)
                // topInputs = setMutation(topInputs,Perce)
                break;
            case 4:
                // 4 diable specific genes and try to find the one's that make it worse/unesesarely slower
                topInputs = changeMutation(topInputs,Perce)
                break
        }

        topInputs = topInputs.concat(catigories[1])
        if (ans.length == 0){
            ans = topInputs
        }else{
            ans = ans.concat(topInputs)
        }

    }
    // if (species.length < 200){
    //     console.log(element)
    // }
    return ans
}

crossover = (element,n) =>{
    element = sortInputsByVal(element);
    const deltedL = Math.floor(element.length/n)
    for (var i = deltedL; i < element.length;i++){
        if (i == deltedL){
            element[i] = mix(element[0],element[1])
        }else{
            element[i] = mix(element[i-deltedL-1],element[i-deltedL])
        }
    }
    return element
}
mix = (net1,net2) =>{
    var first = net2
    var second = net1
    if (net1.value > net2.value){
        first = net1
        second = net2
    }
    let third = {NN:[],value:0,topIno:0}
    for (var i = 0; i < first.NN.length;i++){
        third.NN.push([])
        first.NN[i].forEach(element =>{
            var options = find(element.inovationNumber,second.NN[i])
            if (options[0]){
                if (Math.random > 0.5){
                    third.NN[i].push(element)
                }else{
                    third.NN[i].push(options[1])
                }
            }else{
                third.NN[i].push(element)
            }
        })
    }
    // console.log(third)
    return third
    //{value:0,biase:0,inovationNumber:neuronInovationNumber,activation:activ,weights:[]}
}
find = (num,array) =>{
    array.forEach(element =>{
        if (element.inovationNumber == num){
            return [true,element]
        }
    })
    return false
}
speciate = (world,different) =>{
    var neurons = []
    var weights = []
    world.forEach(element =>{
        neurons.push([])
        weights.push([])
        element.NN.forEach(layers =>{
            layers.forEach(neuron =>{
                neurons[neurons.length-1].push(neuron.inovationNumber)
                neurons.forEach(weights1 =>{
                    weights[weights.length-1].push(weights1.inovationNumber)
                })
            })
        })
    })
    var species = []
    var temporaryTags = []
    for (var i =0; i < world.length;i++){
        if (i == 0){
            species.push([])
            species[species.length-1].push(world[0])
            temporaryTags.push([neurons[i],weights[i]])
        }else{
            var pass = false
            for (var b =0; b < temporaryTags.length;b++){
                if (removeCommon(neurons[i],temporaryTags[b][0]) + (removeCommon(weights[i],temporaryTags[b][1])/2) + Math.floor(world[i].NN.length/2) <= different){
                    species[b].push(world[i])
                    pass = true
                    b = temporaryTags.length
                }
            }
            if (pass == false){
                species.push([])
                species[species.length-1].push(world[i])
                temporaryTags.push([neurons[i],weights[i]]) 
            }
        }
    }
    return species
}
removeCommon = (first, second) => {
    ans = []
    first.forEach(num1 =>{
        var pass = false
        second.forEach(num2 =>{
            if (num1 === num2){
                pass = true
            }
        })
        if (pass == false){
            ans.push(num1)
        }
    })
    return ans.length
 };
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
        if (!k){
        // set1 = [{value:0,biase:0,inovationNumber:neuronInovationNumber,activation:activ,weights:[]}]
        for (var node0 = 0; node0 < layers[l-1];node0++){
            // set1[node].weights.push([])
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
        try{
            add += (world[n].NN[wei.layer][wei.neuron].value * wei.value)
        }catch{
            console.log(world[n].NN[wei.layer],wei.neuron,wei.layer,n)
            // add += (world[n].NN[wei.layer][0].value * wei.value)
            // throw "YEET"
            world[n].NN[layer][neurons].weights.splice(b,1)
        }
    }
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
}
fill = (n,layers) =>{
    for (var n2 = 1; n2 < world[n].NN.length; n2++){
        for (var n3 = 0; n3 < world[n].NN[n2].length; n3++){
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