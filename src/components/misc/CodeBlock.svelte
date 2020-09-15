<script>
	import hljs from 'highlight.js/lib/core';
	import hljs_js from 'highlight.js/lib/languages/javascript';
	import hljs_xml from 'highlight.js/lib/languages/xml';
	import hljs_css from 'highlight.js/lib/languages/css';
	import hljs_php from 'highlight.js/lib/languages/php';
	import hljs_json from 'highlight.js/lib/languages/json';
	import hljs_yaml from 'highlight.js/lib/languages/yaml';
	import hljs_plain from 'highlight.js/lib/languages/plaintext';

	hljs.registerLanguage('javascript', hljs_js);
	hljs.registerLanguage('xml', hljs_xml);
	hljs.registerLanguage('css', hljs_css);
	hljs.registerLanguage('php', hljs_php);
	hljs.registerLanguage('json', hljs_json);
	hljs.registerLanguage('yaml', hljs_yaml);
	hljs.registerLanguage('plaintext', hljs_plain);

	export let code;
	export let language = 'plaintext';

	$: highlighted = hljs.highlight(language, code, true).value;
</script>

<pre class="uk-margin-remove uk-padding-remove">
	<code class="hljs uk-height-max-large">
		{#if highlighted !== undefined}
			{@html highlighted}
		{:else}
			{code}
		{/if}
	</code>
</pre>