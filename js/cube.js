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

