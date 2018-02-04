import React from 'react';

function DivTableElement(classType, props) {
  return (
    <div className={classType} style={props.style}>
      {props.children}
    </div>
  );
}

export const TH = (props) => DivTableElement('th', props);
export const TD = (props) => DivTableElement('td', props);
export const TR = (props) => DivTableElement('tr', props);
export const THEAD = (props) => DivTableElement('thead', props);
export const TBODY = (props) => DivTableElement('tbody', props);
export const TABLE = (props) => DivTableElement('table', props);