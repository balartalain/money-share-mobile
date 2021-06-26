import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import { Animated, Text, View } from 'react-native';

class FadeView extends React.Component {
  state = {
    fadeInAnim: new Animated.Value(0),  // Initial value for opacity: 0
    fadeInAnim: new Animated.Value(1),
  }

  componentDidMount() {
    Animated.timing(                  // Animate over time
      this.state.fadeInAnim,            // The animated value to drive
      {
        toValue: 1,                   // Animate to opacity: 1 (opaque)
        duration: 1000,              // Make it take a while
      }
    ).start();                        // Starts the animation
  }

  unmountComponentAtNode() {
    Animated.timing(                  // Animate over time
      this.state.fadeInAnim,            // The animated value to drive
      {
        toValue: 1,                   // Animate to opacity: 1 (opaque)
        duration: 1000,              // Make it take a while
      }
    ).start();                        // Starts the animation
  }

  render() {
    let { fadeAnim } = this.state;

    return (
      <Animated.View                 // Special animatable View
        style={{
          ...this.props.style,
          opacity: fadeAnim,         // Bind opacity to animated value
        }}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}
export default FadeOutView;
// Use
// You can then use your `FadeInView` in place of a `View` in your components:
// export default class App extends React.Component {
//     render() {
//       return (
//         <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
//           <FadeInView style={{width: 250, height: 50, backgroundColor: 'powderblue'}}>
//             <Text style={{fontSize: 28, textAlign: 'center', margin: 10}}>Fading in</Text>
//           </FadeInView>
//         </View>
//       )
//     }
//   }