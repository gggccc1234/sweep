var row_size=20;
var col_size=20;
var width_size=20;
var height_size=20;
var map_data=[];
var boom_num=30;
var around_box=[-1,0,1];
var map_boom=[];
var map_dom=[];
var is_hide=[];
var zero_dom=[];
var colors=["rgb(135, 206, 235)","rgb(255, 0, 0)","rgb(255, 255, 0)"];
var user_data=[];



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
    for(var i=0;i<row_size;i++){
        var map=[];
        var user=[];
        for(var j=0;j<col_size;j++){
            map.push(0);
            user.push(0);
        }
        map_data.push(map);
        user_data.push(user);
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
        var is_hides=[];
        for(var j=0;j<col_size;j++){
            var newDiv=$("<div></div>");
            newDiv.css({
                "width": width_size-1,
                "height": height_size-1,
                "position": "absolute",
                "top": i*height_size,
                "left": j*width_size,
                "border": "1px solid #000",
                "color": "#fff",
                "text-align": "center",
                "cursor": "pointer",
            });
            if(map_data[i][j]==1){
                newDiv.css({
                    "background": "#fff",
                })
            }
            else if(map_data[i][j]==0){
                if(map_boom[i][j]!=0){
                    newDiv.text(map_boom[i][j]);
                }
            }
            var newMask=$("<div></div>");
            newMask.attr('x',i).attr('y',j);
            newMask.css({
                "width": "100%",
                "height": "100%",
                "background": "skyblue",
                "position": "absolute",
                "top": "0",
                "left": "0",
                "opacity": "0.5",
            });
            newMask.mousedown(function(e) {
                //右键为3
                var x=$(this).attr('x');
                var y=$(this).attr('y');
                if (3 == e.which) {
                    var temp_color=$(this).css("background-color");
                    for(var k=0;k<colors.length;k++){
                        if(temp_color==colors[k]){
                            user_data[x][y]=(user_data[x][y]+1)%colors.length;
                            k=(k+1)%colors.length;
                            $(this).css({
                                "background-color": colors[k],
                            })
                            if(victory()==true){
                                openall();
                                alert("你赢了");
                            }
                            return;
                        }
                    }               
                }
                else if (1 == e.which) {
                    //左键为1
                    if(map_data[x][y]==1){
                        openall();
                        alert("你输了");
                    }
                    hidezero(x,y);
                }
            });
            is_hides.push(0);
            temp_dom.push(newMask);
            newDiv.append(newMask);
            $("#game").append(newDiv);
        }
        is_hide.push(is_hides);
        map_dom.push(temp_dom);
    }
}

function hidezero(x,y){
    if(is_hide[x][y]==1||user_data[x][y]!=0)return;
    zero_dom=[];
    zero_dom.push(map_dom[x][y]);
    is_hide[x][y]=1;
    while(zero_dom.length>0){
        var x=$(zero_dom[0]).attr('x');
        var y=$(zero_dom[0]).attr('y');
        zero_dom[0].hide();
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
            map_dom[i][j].hide();
        }
    }
}