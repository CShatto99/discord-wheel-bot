export default function shuffleArray<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    let randomIdx = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIdx]] = [array[randomIdx], array[i]];
  }
}
