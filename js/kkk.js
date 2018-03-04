var datas=[];
for(var i=0;i<27;i++){
    var temp_data=[];
    for(var j=0;j<48;j++){
        temp_data.push(0);
    }
    datas.push(temp_data);
}
function write_letter(letter,x,y){
    for(var i=0;i<letter.length;i++){
        for(var j=0;j<letter[0].length;j++){
            datas[i+x][j+y]=letter[i][j];
        }
    }
}
var letters=[
    //p
    [
        [1,1,1,1,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,1,1,1,1],
        [1,0,0,0,0],
    ],
    //l
    [
        [1,1,0,0,0],
        [1,1,0,0,0],
        [1,1,0,0,0],
        [1,1,0,0,0],
        [1,1,1,1,1],
    ],
    //a
    [
        [0,0,1,0,0],
        [0,1,0,1,0],
        [1,0,0,0,1],
        [1,1,1,1,1],
        [1,0,0,0,1],
    ],
    //y
    [
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,1,1,1,1],
        [0,0,1,0,0],
        [0,0,1,0,0],
    ],
    //!
    [
        [1],
        [1],
        [1],
        [0],
        [1],
    ],

];
for(var i=0;i<letters.length;i++){
    write_letter(letters[i],10,i*6+12);
}
var ul_list=[];
var newDiv=$("<div class=\"stage\" onclick=\"return asd()\"></div>");
for(var i=-13;i<14;i++){
    for(var j=-19;j<29;j++){
        // if(datas[i+13][j+19]==1){
            var newUl=$("<ul></ul>");
            newUl.addClass("three-d-box");
            newUl.css({
                "top": i*100+"px",
                "left": j*100+"px",
            });
            for(var k=1;k<7;k++){
                var newLi=$("<li></li>");
                newUl.append(newLi);
            }
            ul_list.push(newUl);
            newDiv.append(newUl);
        // }
    }	
}
$("body").append(newDiv);

// function rand(a,b){
//     return (Math.round(Math.random()*(b-a))+a);
// }

// function randrgb(){
//     var a=rand(0,255);
//     var b=rand(0,255);
//     var c=rand(0,255);
//     return "rgb("+a+","+b+","+c+")";
// }

function renderdata(){
    for(var i=0;i<ul_list.length;i++){
        // var colors=randrgb();
        ul_list[i].css({
            "transform":"translateZ(-1800px)",
        })
        // var len=rand(100,250);
        
    }
}

function asd(){
    renderdata();
}