export const getSpeechRecognition = (onResult, onError, onEnd) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        if (onError) onError("您的瀏覽器不支援 Web Speech API。");
        return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-TW';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (onResult) onResult(transcript);
    };

    recognition.onerror = (event) => {
        if (onError) onError(event.error);
    };

    recognition.onend = () => {
        if (onEnd) onEnd();
    };

    return recognition;
};
