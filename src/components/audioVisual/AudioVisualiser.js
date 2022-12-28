import React, { Component } from 'react';

class AudioVisualiser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: props.type
    };
  }

  componentDidUpdate() {
    this.draw();
  }

  draw() {
    const { audioData } = this.props;
    if (audioData) {
      let canvas = document.getElementById(`canvas${this.state.type}`);

      const height = canvas.height;
      const width = canvas.width;
      const context = canvas.getContext('2d');
      let x = 0;
      const sliceWidth = (width * 1.0) / audioData.length;

      context.lineWidth = 2;
      context.strokeStyle = '#fff';
      context.clearRect(0, 0, width, height);

      context.beginPath();
      context.moveTo(0, height / 2);
      for (const item of audioData) {
        const y = (item / 255.0) * height;
        context.lineTo(x, y);
        x += sliceWidth;
      }
      context.lineTo(x, height / 2);
      context.stroke();
    }
  }

  render() {
    return <canvas id={`canvas${this.state.type}`} width="80" height="35" />;
  }
}

export default AudioVisualiser;