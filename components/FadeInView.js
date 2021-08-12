import React from 'react'
import { Animated} from 'react-native'

class FadeInView extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
        }
        this.duration = this.props.duration || 500
    }
    componentDidMount() {
        Animated.timing(                  // Animate over time
            this.state.fadeAnim,            // The animated value to drive
            {
                toValue: 1,                   // Animate to opacity: 1 (opaque)
                duration: this.duration,              // Make it take a while
                useNativeDriver: false
            }
        ).start()                        // Starts the animation
    }

    render() {
        let { fadeAnim } = this.state
        let scale = this.props.scale?fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        }):1
        return (
            <Animated.View                 // Special animatable View
                style={{
                    ...this.props.style,
                    opacity: fadeAnim,  
                    transform: [
                        {
                            scale: scale,
                        },
                    ],       // Bind opacity to animated value
                }}
            >
                {this.props.children}
            </Animated.View>
        )
    }
}
export default FadeInView
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