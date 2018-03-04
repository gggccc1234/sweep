var level=[[20,40,100],[20,30,70],[20,20,50],[20,10,30]];
var row_size=20;
var col_size=20;
var width_size=20;
var height_size=20;
var map_data=[];
var boom_num=20;
var around_box=[-1,0,1];
var map_boom=[];
var map_dom=[];
var is_hide=[];
var zero_dom=[];
var user_data=[];
var user_length=[0,90,-90];
var hide_speed=0.005;


$(document).ready(
    function(){
        $("div").bind("contextmenu", function(){
            return false;
        });
        redate();
        rendermapboom();
        resize();
    }
);

function rand(a,b){
    return Math.round(Math.random()*(b-a))+a;
}

function redate(){
    map_data=[];
    user_data=[];
    is_hide=[];
    for(var i=0;i<row_size;i++){
        var map=[];
        var user=[];
        var hides=[];
        for(var j=0;j<col_size;j++){
            map.push(0);
            user.push(0);
            hides.push(0);
        }
        map_data.push(map);
        user_data.push(user);
        is_hide.push(hides);
    }
    for(var i=0;i<boom_num;i++){
        var x=rand(0,row_size-1);
        var y=rand(0,col_size-1);
        while(map_data[x][y]!=0){
            if(x==row_size-1&&y==col_size-1){
                x=rand(0,row_size-1);
                y=rand(0,col_size-1);
            }
            else if(y==col_size-1){
                x++;
                y=0;
            }
            else{
                y++;
            }
        };
        map_data[x][y]=1;
    }
}

function resize(){
    $("#game").width(width_size*col_size).height(height_size*row_size);
    for(var i=0;i<row_size;i++){
        var temp_dom=[];
        for(var j=0;j<col_size;j++){
            var newBox=$("<div></div>");
            newBox.addClass("box");
            newBox.css({
                "width": width_size,
                "height": height_size,
                "top": i*height_size,
                "left": j*width_size,
            });
            var newUl=$("<ul></ul>");
            var sx=(5+rand(1,5))*(rand(1,10)>5?1:-1);
            var sy=(5+rand(1,5))*(rand(1,10)>5?1:-1);
            newUl.attr("x",i).attr("y",j).attr("sx",sx).attr("sy",sy);
            newUl.addClass("three-d-box");
            newUl.css({
                "width": width_size-2,
                "height": height_size-2,
            });
            newUl.mousedown(function(e) {
                //右键为3
                var x=$(this).attr('x');
                var y=$(this).attr('y');
                if (3 == e.which&&is_hide[x][y]==0) {
                    user_data[x][y]=(user_data[x][y]+1)%user_length.length;
                    $(this).css({
                        "transform": "rotateY("+user_length[user_data[x][y]]+"deg)",
                    })
                    if(victory()==true){
                        openall();
                        alert("你赢了");
                    }
                    return;          
                }
                else if (1 == e.which) {
                    //左键为1
                    hidezero(x,y);
                    if(map_data[x][y]==1){
                        openall();
                        alert("你输了");
                    }
                }
            });
            for(var k=0;k<6;k++){
                var newLi=$("<li></li>");
                var sx=(5+rand(1,5))*(rand(1,10)>5?1:-1);
                var sy=(5+rand(1,5))*(rand(1,10)>5?1:-1);
                newLi.attr("sx",sx).attr("sy",sy);
                newLi.css({
                    "width": width_size-2,
                    "height": height_size-2,
                });
                if(k==3){
                    if(map_boom[i][j]!=0&&map_boom[i][j]!=999){
                        newLi.text(map_boom[i][j]);
                    }
                }
                newUl.append(newLi);
            }
            temp_dom.push(newUl);
            newBox.append(newUl);
            $("#game").append(newBox);
        }
        map_dom.push(temp_dom);
    }
}

function hidezero(x,y){
    var countTime=0;
    if(is_hide[x][y]==1||user_data[x][y]!=0)return;
    zero_dom=[];
    zero_dom.push(map_dom[x][y]);
    if(map_data[x][y]==1){
        zero_dom[0].addClass("animboom");
        return;
    }
    $(zero_dom[0]).css({
        "animation":"move1 0.5s "+countTime+"s linear",
        "animation-fill-mode":"forwards",
        "color":"rgba(255,255,255,1)",
    });
    is_hide[x][y]=1;
    while(zero_dom.length>0){
        countTime=countTime+hide_speed;
        var x=$(zero_dom[0]).attr('x');
        var y=$(zero_dom[0]).attr('y');
        $(zero_dom[0]).css({
            "animation":"move1 0.5s "+countTime+"s linear",
            "animation-fill-mode":"forwards",
            "color":"rgba(255,255,255,1)",
        })
        zero_dom.shift();
        if(map_boom[x][y]==0){
            for(var i=0;i<around_box.length;i++){
                for(var j=0;j<around_box.length;j++){
                    var tx=x-0+around_box[i],
                        ty=y-0+around_box[j];
                    var temp_around=around_box[i]+around_box[j];
                    if(temp_around!=1&&temp_around!=-1)continue;
                    if(junglenum(tx,ty)==0||user_data[tx][ty]!=0)continue;
                    is_hide[tx][ty]=1;
                    zero_dom.push(map_dom[tx][ty]);
                }
            }
        }
    }
}

function rendermapboom(){
    for(var i=0;i<row_size;i++){
        var list=[];
        for(var j=0;j<col_size;j++){
            if(map_data[i][j]==0)
                list.push(countboom(i,j));
            else list.push(999);
        }
        map_boom.push(list);
    }
}

function countboom(x,y){
    var count=0;
    for(var i=0;i<around_box.length;i++){
        for(var j=0;j<around_box.length;j++){
            if(around_box[i]==0&&around_box[j]==0)
                continue;
            else count=count+jungleboom(around_box[i]+x,around_box[j]+y);
        }
    }
    return count;
}

function jungleboom(x,y){
    if(x>=0&&x<row_size&&y>=0&&y<col_size&&map_data[x][y]==1){
        return 1;
    }
    return 0;
}

function junglenum(x,y){
    if(x>=0&&x<row_size&&y>=0&&y<col_size&&map_boom[x][y]!=999&&is_hide[x][y]==0){
        return 1;
    }
    return 0;
}

function victory(){
    for(var i=0;i<row_size;i++){
        for(var j=0;j<col_size;j++){
            if(map_data[i][j]!=user_data[i][j]){
                return false;
            }
        }
    }
    return true;
}



function openall(){
    for(var i=0;i<row_size;i++){
        for(var j=0;j<col_size;j++){
            map_dom[i][j].css({
                "color":"rgba(255,255,255,1)",
            })
            if(!map_dom[i][j].hasClass("anim")&&map_data[i][j]!=1){
                map_dom[i][j].addClass("anim");
            }
            if(!map_dom[i][j].hasClass("animboom")&&map_data[i][j]==1){
                map_dom[i][j].addClass("animbooms");
            }
        }
    }
    move_down();
    $("#game").css({
        "background": "rgba(0,0,0,0.2)",
    })
}

function move_down(){
    var count1=0;
    for(var i=0;i<row_size;i++){
        for(var j=0;j<col_size;j++){
            if(map_data[i][j]!=1){
                map_dom[i][j].css({
                    "animation":"move4 1s "+count1+"s linear",
                    "animation-fill-mode":"forwards",
                })
                count1=count1+0.01;
            }
        }
    }
}


