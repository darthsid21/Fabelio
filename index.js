var express = require('express')
var app = express()
var csv = require('csv-parser')
var fs = require('fs')
var similarity = require('compute-cosine-similarity')
var string_similarity = require('string-cosine-similarity')
app.set('view engine','pug')
var results = []
var sum = 0
var sum1 = 0
var sd = 0
var i = 0
var sorted_array = []
fs.createReadStream('data.csv')                            //csv parser
    .pipe(csv())
    .on('data',(data) => results.push(data))
    .on('end', () => {
        //console.log(results)
        
        for(x of results){
            
          sum += Number(x.price)
        //  console.log(sum)
        }
        var mean = sum/results.length
        for(x of results){
            sum1+=(Number(x.price)-Number(results[0].price))**2
        }
        sd = (sum1/results.length)**0.5 //deviation wrt sofa 2 price 


        for(i=0;i<results.length;i++){
            results[i].score=item_similarity(results[0],results[i])
        }
        for(x of results){
            console.log(x.score)
        }
        sorted_array = bubble_Sort(results)
        console.log(sorted_array)
        }
        
    )
       
var len1 = results.length

function name_similarity(name1,name2){
    return string_similarity(name1,name2)
}

function dimension_similarity(dim1,dim2){
   var d1 = dim1.split(" x ")
   var d2 = dim2.split(" x ")
   var arr1 = [Number(d1[0]),Number(d1[1],Number(d1[2]))]
   var arr2 = [Number(d2[0]),Number(d2[1],Number(d2[2]))]
   return similarity(arr1,arr2)
    }


function color_similarity(color1,color2 ){
return string_similarity(color1,color2)
}

function price_similarity(price1,price2){
    var p1 = Number(price1)
    var p2 = Number(price2)
    return 1-Math.abs((p2-p1)/sd)

}
function material_similarity(mat1,mat2){
    if(isNaN(string_similarity(mat1,mat2))){
        return 0
    }
    return string_similarity(mat1,mat2)

}

function item_similarity(item1,item2){
    console.log(material_similarity(item1.material,item2.material))
    return name_similarity(item1.product_name,item2.product_name) + dimension_similarity(item1.dimension,item2.dimension) + color_similarity(item1.colours,item2.colours) + price_similarity(item1.price,item2.price) + material_similarity(item1.material,item2.material)
}

function bubble_Sort(a)
{
    var swapp;
    var n = a.length-1;
    var x=a;
    do {
        swapp = false;
        for (var i=0; i < n; i++)
        {
            if (x[i].score < x[i+1].score)
            {
               var temp = x[i];
               x[i] = x[i+1];
               x[i+1] = temp;
               swapp = true;
            }
        }
        n--;
    } while (swapp);
 return x; 
}






var current_pointer = 1

app.get("/",function(req,res){                       //rendering
     res.render('template',{obj:sorted_array[current_pointer]})
     current_pointer+=1
     current_pointer=current_pointer%9
     if(current_pointer==0){
     current_pointer=1
     }
})




var listener =  app.listen(3000,function(){
    console.log("Listening at port 3000")
})
