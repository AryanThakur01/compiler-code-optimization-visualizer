import { useRef, useEffect } from 'react'

const TypingSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null)
  const bufferRef = useRef<AudioBuffer | null>(null)

  useEffect(() => {
    audioContextRef.current = new AudioContext()
    fetch('/keyboard-typing.mp3')
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioContextRef.current!.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        bufferRef.current = audioBuffer
      })
  }, [])

  const playTypingSound = () => {
    if (audioContextRef.current && bufferRef.current) {
      const source = audioContextRef.current.createBufferSource()
      source.buffer = bufferRef.current
      source.connect(audioContextRef.current.destination)
      source.start()
    }
  }

  return { playTypingSound }
}

export default TypingSound
