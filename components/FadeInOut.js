import React, {Component} from 'react'
import { Animated, View, Text } from 'react-native'

class FadeInOut extends Component {
    constructor(props){
        super(props)
        this.state = {
            visible: this.props.visible
        }
        this.fadeAnim = new Animated.Value(0),
            
        this.duration = this.props.duration || 500
    }
    componentDidMount() {
        if (this.props.visible){
            this.fadeAnim = new Animated.Value(0)
            Animated.timing(                  // Animate over time
                this.fadeAnim,            // The animated value to drive
                {
                    toValue: 1,                   // Animate to opacity: 1 (opaque)
                    duration: this.duration,              // Make it take a while
                    useNativeDriver: false
                }
            ).start()
        }                     // Starts the animation
    }
    componentDidUpdate(prevProps) {
        if (prevProps.visible && !this.props.visible) {
            // Unmount animation
            //this.fadeAnim = new Animated.Value(1)
            Animated.timing(                  // Animate over time
                this.fadeAnim,            // The animated value to drive
                {
                    toValue: 0,                   // Animate to opacity: 1 (opaque)
                    duration: this.duration,              // Make it take a while
                    useNativeDriver: false
                }
            ).start(()=>{
                this.setState({visible: false})
            })               
        } else if (!prevProps.visible && this.props.visible){
            // Show animation
            this.setState({visible: true})
            //this.fadeAnim = new Animated.Value(0)
            Animated.timing(                  // Animate over time
                this.fadeAnim,            // The animated value to drive
                {
                    toValue: 1,                   // Animate to opacity: 1 (opaque)
                    duration: this.duration,              // Make it take a while
                    useNativeDriver: false
                }
            )     
        }
    }

    render() {
        const { style, children, ...rest } = this.props
        
        const containerStyle = {
            opacity: this.fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
            }),
            transform: [
                {
                    scale: this.fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                    }),
                },
            ],
        }

        const combinedStyle = [containerStyle, style]
        return (
            <Animated.View style={ this.state.visible ? combinedStyle : containerStyle} {...rest}>
                {this.state.visible ? children : null}
            </Animated.View>
        )
       
    }
}
export default FadeInOut