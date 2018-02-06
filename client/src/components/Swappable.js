import React from 'react';
// import PropTypes from 'prop-types'


// Create the first element of a row. Handle bluring/focusing on subelements,
// render 'staticReplacement' when unfocussed on mobile. 
// Focus massively improved by https://medium.com/@jessebeach/dealing-with-focus-and-blur-in-a-composite-widget-in-react-90d3c3b49a9b
class Swappable extends React.Component {
  _ref;

  constructor(props) {
    super(props);
    this.state = {
      // if one of this element's children is focused
      isManagingFocus: false
    };
  }

  onFocusCB(e) {
    // console.log('was focused:', e.target);
    this.props.swapCB(this.props.index, true);
  }

  onBlurCB(e) {
    // console.log('was blurred:', e.target);
    this.props.swapCB(this.props.index, false);
  }

  focusChild() {
    console.log(`calling focus on ${this.props.index}`)
    this._ref.selectInput();
  }
 
  render() {
    let innerComp = this.props.children[this.props.interactive ? 0 : 1];
    let style = this.props.index > 0 ? {float: 'right'} : {};
    let className = 'Swappable ' + (this.props.interactive ? 'interactive' : 'noninteractive');
    return (
      <div className={className}
        style={style}
        onBlur={this.onBlurCB.bind(this)}
        onFocus={this.onFocusCB.bind(this)}
      >
        {React.cloneElement(
          innerComp, 
          { 
            ref: (ref) => { this._ref = ref; }
          }
        )}
      </div>
    );
  }
}

// RowHeader_2.propTypes = {
//   children:          PropTypes.array.isRequired,
//   useMobileUI:       PropTypes.bool.isRequired,
//   staticReplacement: PropTypes.func.isRequired
// }

export { Swappable };