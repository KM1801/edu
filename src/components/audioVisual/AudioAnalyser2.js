import React, { Component } from 'react';
import AudioVisualiser2 from './AudioVisualiser2';

class AudioAnalyser2 extends Component {
  constructor(props) {
    super(props);
    this.state = { audioData: new Uint8Array(0) };
    this.tick = this.tick.bind(this);
    this.state.type = props.type;
  }

  componentDidMount() {
    if (this.props.audio) {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      this.source = this.audioContext.createMediaStreamSource(this.props.audio);
      this.source.connect(this.analyser);
      this.rafId = requestAnimationFrame(this.tick);
    }
  }

  tick() {
    this.analyser.getByteTimeDomainData(this.dataArray);
    this.setState({ audioData: this.dataArray });
    this.rafId = requestAnimationFrame(this.tick);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rafId);
    this.analyser.disconnect();
    this.source.disconnect();
  }

  render() {
   return <AudioVisualiser2 audioData={this?.state?.audioData} type={this.state.type} />;
  }
}

export default AudioAnalyser2;
