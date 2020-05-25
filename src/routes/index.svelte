<script>
	import URLShortener from '../components/tools/URLShortener.svelte';
	import DummyTextGenerator from '../components/tools/DummyTextGenerator.svelte';
	import FaviconGenerator from '../components/tools/FaviconGenerator.svelte';
	import RuleOfThree from '../components/tools/RuleOfThree.svelte';
	import ImageCompressor from '../components/tools/ImageCompressor.svelte';
	import ColorConverter from '../components/tools/ColorConverter.svelte';
	import QRCodeGenerator from '../components/tools/QRCodeGenerator.svelte';
	import TextCounter from '../components/tools/TextCounter.svelte';
	import Base64EncoderDecoder from '../components/tools/Base64EncoderDecoder.svelte';
	import Clipboard from '../components/helper/Clipboard.svelte';
	import Alert from '../components/helper/Alert.svelte';

	let copyText;
	let showAlert;
</script>

<div class="uk-grid-medium" uk-grid uk-sortable="handle: .uk-sortable-handle">
	<Base64EncoderDecoder {copyText} />
	<TextCounter />
	<QRCodeGenerator />
	<ImageCompressor {showAlert} />
	<ColorConverter {copyText} />
	<RuleOfThree />
	<FaviconGenerator {showAlert} />
	<URLShortener {copyText} {showAlert} />
	<DummyTextGenerator {copyText} />
</div>

<Clipboard bind:copyText />
<Alert bind:showAlert />