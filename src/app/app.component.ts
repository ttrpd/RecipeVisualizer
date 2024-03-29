import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit{
  title = 'recipe-visualizer';
  @ViewChild('outer') outer: ElementRef;

  recipe = "bake( divide( mix(chocolate, coconut, pecans, mix(eggs, whisk(flour, baking powder, baking soda, salt), cream(butter, sugars))) ) )";

  get_func_dom(func_name:string) {
    // create parent, left-child, and right-child divs
    var parent = document.createElement("div");
    var child_left = document.createElement("div");
    var child_right = document.createElement("div");
    var child_right_text = document.createElement("p");
    // set attributes for these divs
    parent.setAttribute("class", "parent");
    child_left.setAttribute("class", "child-left");
    child_right.setAttribute("class", "child-right");
    child_right.setAttribute("id", func_name);
    child_right_text.textContent = func_name;
    // append divs to parent
    child_right.appendChild(child_right_text);
    parent.appendChild(child_left);
    parent.appendChild(child_right);

    return parent;
  }

  /**
   * Parses a list of parameters, some of which may be functions
   */
  parse_params(src:string, func_name:string) {
    var args = [];
    var curr_arg = ""
    var curr_pos = 0
    
    // get dom structure for this function and its new parameters
    var dom = this.get_func_dom(func_name);
    var params = dom.getElementsByClassName("child-left")[0];
    
    while (curr_pos < src.length) {
      // if chracter is ','
      if (src.charAt(curr_pos) == ',') {
        // if curr_arg is empty, throw an error
        if (!curr_arg) {
          throw new Error("expected argument before ','");
        }
        // push curr_arg onto args
        args.push(curr_arg);
        // reset curr_arg
        curr_arg = "";
      }
      // if character is '(', parse function starting at curr_pos - curr_arg.length
      else if (src.charAt(curr_pos) == '(')  {
        var parsed = this.parse_func( src.substr(curr_pos - curr_arg.length) );
        // set curr_pos to return value from function
        curr_pos += parsed.end - curr_arg.length;
        // parse past the ensuing comma delimiter
        curr_pos += src.substr(curr_pos).indexOf(",")+1;
        // add parsed dom to parameters dom
        params.appendChild(parsed.dom);
        // reset curr_arg
        curr_arg = "";
      }
      // else add character to arg
      else {
        curr_arg += src.charAt(curr_pos);
      }
      
      curr_pos++;
    }

    // push last arg onto args
    if (curr_arg)
      args.push(curr_arg);

    console.log(args);
    // construct parameters side of function dom
    for (var i = 0; i < args.length; i++) {
      // build a div for each argument and append it to params
      var param = document.createElement("div");

      var param_name = document.createElement("p");
      param_name.textContent = args[i];
      param.appendChild(param_name);
      params.appendChild(param);
    }
    return dom;
  }

  parse_func(src:string) {
    //// get function ////
    var verb = src.substr(0, src.indexOf("("));
    //// get parameters ////
    var start_pos = src.indexOf("(") + 1;
    // end_pos starts just after the '('
    var end_pos = start_pos;
    // keep track of how many nested functions we've gone through
    var level = -1
    while (end_pos < src.length) {
      // if '(', go down a level
      if(src.charAt(end_pos) == '(') level--;
      // if ')', go up a level
      if(src.charAt(end_pos) == ')') level++;
      // if we've just climbed out of the original function,
      // end_pos is at the closing ')'
      if(level == 0) break;

      end_pos++;
    }
    // handle unclosed parenthesis
    if (level < 0) throw new Error("Unclosed parenthesis");

    //// get function dom by recursing, passing arguments to parse_params ////
    var dom = this.parse_params(src.substr(start_pos, end_pos-start_pos), verb);
    // return end_pos and parent
    return {end:end_pos+1, dom:dom};
  }

  on_recipe_change(new_recipe:string) {
    this.recipe = new_recipe;
    this.rebuild_recipe();
  }

  rebuild_recipe() {
    var dom = this.parse_func(this.recipe).dom;
    this.outer.nativeElement.innerHTML = "";
    this.outer.nativeElement.appendChild(dom);
  }

  ngAfterViewInit () {
    // // this.get_func_dom test
    // this.outer.nativeElement.appendChild(this.get_func_dom("test"));

    // // basic param parsing test
    // var basic_params = "param1, param2, param3, param4";
    // var func = this.parse_params(basic_params, "test");
    // this.outer.nativeElement.appendChild(func);

    // // basic function parsing test
    // var basic_function = "func1(param1, param2, param3)";
    // var func = this.parse_func(basic_function).dom;
    // this.outer.nativeElement.appendChild(func);

    // // one nested function param parsing test
    // var one_nested_func = "param1, param2, func1(subparam1, subparam2), param3";
    // var dom = this.parse_params(one_nested_func, "test_func_name");
    // this.outer.nativeElement.appendChild(dom);

    // // empty function test
    // var one_nested_func = "func()";
    // var dom = this.parse_func(one_nested_func).dom;
    // this.outer.nativeElement.appendChild(dom);

    // // empty params test
    // var one_nested_func = ",,";
    // var dom = this.parse_params(one_nested_func, "test_func_name");
    // this.outer.nativeElement.appendChild(dom);

    // // actual recipe test
    // var dom = this.parse_func(this.recipe).dom;
    // this.outer.nativeElement.appendChild(dom);
  }
}
