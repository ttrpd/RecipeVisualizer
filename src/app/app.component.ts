import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit{
  title = 'recipe-visualizer';
  @ViewChild('outer') outer: ElementRef;

  recipe = "bake( divide( mix(chocolate, coconut, pecans, mix(eggs, whisk(dry_ingredients), cream(butter, sugars))) ) )";

  add_func_to_dom(func_name:string) {

    var parent = document.createElement("div");
    parent.setAttribute("class", "parent");
    var child_left = document.createElement("div");
    child_left.setAttribute("class", "child-left");
    var child_right = document.createElement("div");
    child_right.setAttribute("class", "child-right");
    child_right.setAttribute("id", func_name);
    var child_right_text = document.createElement("p");
    child_right_text.textContent = func_name;
    child_right.appendChild(child_right_text);

    return parent;
  }

  /**
   * Parses a list of parameters, some of which may be functions
   */
  parse_params(src:string, dom_el:HTMLDivElement) {
    var args = [];
    var curr_arg = ""
    var curr_pos = 0
    while (curr_pos < src.length) {
      // if chracter is ',' && curr_arg not empty, push curr_arg onto args
      // if character is '(', parse function starting at curr_pos - curr_arg.length
      //   set curr_pos to return value from function
      // else add character to arg
    }
    // add args to dom
  }

  parse_func(src:string, dom_el:HTMLDivElement) {
    //// get function ////
    var verb = src.substr(0, src.indexOf("("));
    //// get parameters ////
    // end_pos starts just after the '('
    var end_pos = src.indexOf("(") + 1;
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

    //// get new parent to dom_el with verb as right child ////
    
    //// get params by recursing, passing arguments to parse_params ////
    
    //// add arguments to parent as left child ////

    return end_pos;
  }

  ngAfterViewInit () {
    var parent = document.createElement("div");
    parent.setAttribute("class", "parent");
    var child_left = document.createElement("div");
    child_left.setAttribute("class", "child-left");
    var child_right = document.createElement("div");
    child_right.setAttribute("class", "child-right");
    var child_right_text = document.createElement("p");
    child_right_text.textContent = "child right";
    child_right.appendChild(child_right_text);

    this.outer.nativeElement.appendChild(parent);
    parent.appendChild(child_left);
    parent.appendChild(child_right);

    for(var i = 0; i < 3; i++)
    {
      var child = document.createElement("div");
      child.textContent = i.toString();
      child_left.appendChild(child);
    }
  }
}
