import React from 'react';

function DivTableElement(classType, props) {
  return <div className={classType}>{props.children}</div>;
}

export const TH = (props) => DivTableElement('th', props);
export const TD = (props) => DivTableElement('td', props);
export const TR = (props) => DivTableElement('tr', props);