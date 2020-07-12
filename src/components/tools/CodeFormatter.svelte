<script>
	import { writable } from 'svelte/store';
	import Tool from './Tool.svelte';
	import CodeBlock from '../misc/CodeBlock.svelte';
	import prettier from 'prettier/standalone';
	import prettier_js from 'prettier/parser-babel';
	import prettier_html from 'prettier/parser-html';
	import prettier_css from 'prettier/parser-postcss';
	import prettier_php from '@prettier/plugin-php/standalone';
	import hljs from 'highlight.js/lib/core';
	import hljs_js from 'highlight.js/lib/languages/javascript';
	import hljs_xml from 'highlight.js/lib/languages/xml';
	import hljs_css from 'highlight.js/lib/languages/css';
	import hljs_php from 'highlight.js/lib/languages/php';
	import hljs_json from 'highlight.js/lib/languages/json';

	hljs.registerLanguage('javascript', hljs_js);
	hljs.registerLanguage('xml', hljs_xml);
	hljs.registerLanguage('css', hljs_css);
	hljs.registerLanguage('php', hljs_php);
	hljs.registerLanguage('json', hljs_json);

	let printWidth = writable(80);
	let tabWidth = writable(4);
	let useTabs = writable(false);
	let semi = writable(true);
	let singleQuote = writable(false);
	let quoteProps = writable('as-needed');
	let jsxSingleQuote = writable(false);
	let trailingComma = writable('es5');
	let bracketSpacing = writable(true);
	let jsxBracketSameLine = writable(false);
	let arrowParens = writable('always');
	let htmlWhitespaceSensitivity = writable('css');
	let phpVersion = writable('7.4');
	let braceStyle = writable('1tbs');
	let endOfLine = writable('lf');

	const settings = [
		{
			type:        'number',
			name:        'Hard wrap at',
			placeholder: 'f.e. 80',
			bind:        printWidth,
			min:         0,
		},
		{
			type:        'number',
			name:        'Indent Width',
			placeholder: 'f.e. 4',
			bind:        tabWidth,
			min:         0,
		},
		{
			type: 'checkbox',
			name: 'Indent lines with tabs instead of spaces',
			bind: useTabs,
		},
		{
			type: 'checkbox',
			name: 'Print semicolons at the ends of statements [JS only]',
			bind: semi,
		},
		{
			type: 'checkbox',
			name: 'Use single quotes instead of double quotes',
			bind: singleQuote,
		},
		{
			type:    'select',
			name:    'Change when properties in objects are quoted [JS only]',
			options: [
				{ name: 'Only add quotes around object properties where required', value: 'as-needed' },
				{ name: 'If at least one property in an object requires quotes, quote all properties', value: 'consistent' },
				{ name: 'Respect the input use of quotes in object properties', value: 'preserve' },
			],
			bind:    quoteProps,
		},
		{
			type: 'checkbox',
			name: 'Use single quotes instead of double quotes in JSX [JS only]',
			bind: jsxSingleQuote,
		},
		{
			type:    'select',
			name:    'Trailing Commas [JS only]',
			options: [
				{ name: 'Trailing commas where valid in ES5 (objects, arrays, etc.)', value: 'es5' },
				{ name: 'No trailing commas', value: 'none' },
				{ name: 'Trailing commas wherever possible (including function arguments)', value: 'all' },
			],
			bind:    trailingComma,
		},
		{
			type: 'checkbox',
			name: 'Print spaces between brackets in object literals',
			bind: bracketSpacing,
		},
		{
			type: 'checkbox',
			name: 'Put the <code>></code> of a multi-line JSX element at the end of the last line instead of being alone on the next line (does not apply to self closing elements) [JS only]',
			bind: jsxBracketSameLine,
		},
		{
			type:    'select',
			name:    'Include parentheses around a sole arrow function parameter [JS only]',
			options: [
				{ name: 'Always include parens. Example: (x) => x', value: 'always' },
				{ name: 'Omit parens when possible. Example: x => x', value: 'avoid' },
			],
			bind:    arrowParens,
		},
		{
			type:    'select',
			name:    'Specify the global whitespace sensitivity for HTML files [HTML only]',
			options: [
				{ name: 'Respect the default value of CSS "display" property', value: 'css' },
				{ name: 'Whitespaces are considered sensitive', value: 'strict' },
				{ name: 'Whitespaces are considered insensitive', value: 'ignore' },
			],
			bind:    htmlWhitespaceSensitivity,
		},
		{
			type:    'select',
			name:    'PHP Version [PHP only]',
			options: [
				{ name: '5.0', value: '5.0' },
				{ name: '5.1', value: '5.1' },
				{ name: '5.2', value: '5.2' },
				{ name: '5.3', value: '5.3' },
				{ name: '5.4', value: '5.4' },
				{ name: '5.5', value: '5.5' },
				{ name: '5.6', value: '5.6' },
				{ name: '7.0', value: '7.0' },
				{ name: '7.1', value: '7.1' },
				{ name: '7.2', value: '7.2' },
				{ name: '7.3', value: '7.3' },
				{ name: '7.4', value: '7.4' },
			],
			bind:    phpVersion,
		},
		{
			type:    'select',
			name:    'Brace Style [PHP only]',
			options: [
				{ name: 'Move opening brace onto new line (PSR-2)', value: 'psr-2' },
				{ name: 'Keep opening brace on same line (1TBS)', value: '1tbs' },
			],
			bind:    braceStyle,
		},
		{
			type:    'select',
			name:    'Newline separator to use when formatting',
			options: [
				{ name: 'LF (Unix)', value: 'lf' },
				{ name: 'CRLF (Windows)', value: 'crlf' },
				{ name: 'CR', value: 'crlf' },
				{ name: 'Auto (Keep existing)', value: 'auto' },
			],
			bind:    endOfLine,
		},
	];

	const languages = {
		xml:        'HTML',
		css:        'CSS',
		javascript: 'JavaScript',
		php:        'PHP',
		json:       'JSON',
	};

	let codeLang = 'auto';
	let detectedLang = '';

	let inputCode = '';
	let inputCodeError = false;

	let outputCode = '';

	let timeout;
	let innerWidth;

	export let copyText;

	function setCodeLanguage(lang) {
		codeLang = lang;
		prettifyCode();
	}

	function detectLanguage() {
		const highlightResponse = hljs.highlightAuto(inputCode, Object.keys(languages));
		if (highlightResponse) {
			detectedLang = highlightResponse.language;
			return highlightResponse.language;
		}

		return false;
	}

	function prettifyCode() {
		inputCodeError = false;

		if (inputCode.trim() === '') return;

		let parser = codeLang === 'auto' ? detectLanguage() : codeLang;

		if (parser === 'javascript') parser = 'babel';
		if (parser === 'xml') parser = 'html';

		if (!parser) {
			inputCodeError = true;
			return;
		}

		const options = {
			parser:                    parser,
			plugins:                   [
				prettier_js,
				prettier_html,
				prettier_css,
				prettier_php,
			],
			printWidth:                $printWidth,
			tabWidth:                  $tabWidth,
			useTabs:                   $useTabs,
			semi:                      $semi,
			singleQuote:               $singleQuote,
			quoteProps:                $quoteProps,
			jsxSingleQuote:            $jsxSingleQuote,
			trailingComma:             $trailingComma,
			bracketSpacing:            $bracketSpacing,
			jsxBracketSameLine:        $jsxBracketSameLine,
			arrowParens:               $arrowParens,
			htmlWhitespaceSensitivity: $htmlWhitespaceSensitivity,
			endOfLine:                 $endOfLine,
			phpVersion:                $phpVersion,
			braceStyle:                $braceStyle,
			trailingCommaPHP:          $trailingComma !== 'none',
		};

		try {
			outputCode = prettier.format(inputCode, options);
		} catch (e) {
			console.error(e);
			inputCodeError = true;
		}
	}

	function prettifyCodeTimeout() {
		clearTimeout(timeout);

		timeout = setTimeout(() => {
			prettifyCode();
		}, 1000);
	}

	[
		printWidth,
		tabWidth,
		useTabs,
		semi,
		singleQuote,
		quoteProps,
		jsxSingleQuote,
		trailingComma,
		bracketSpacing,
		jsxBracketSameLine,
		arrowParens,
		htmlWhitespaceSensitivity,
		phpVersion,
		braceStyle,
		endOfLine,
	].forEach(store => store.subscribe(() => prettifyCode()));
</script>

<Tool title="Web Formatter" {settings} settingsInfo="https://prettier.io/docs/en/options.html">
	<ul class="uk-subnav uk-subnav-pill uk-child-width-expand uk-margin-small-bottom" class:uk-flex-column={innerWidth < 640}>
		<li class:uk-active={codeLang === 'auto'} class="uk-text-center"><a on:click={() => setCodeLanguage('auto')} href="">Auto</a></li>

		{#each Object.entries(languages) as language}
			<li class:uk-active={codeLang === language[0]} class="uk-text-center">
				<a on:click={() => setCodeLanguage(language[0])} class:uk-text-primary={detectedLang === language[0] && codeLang === 'auto' && inputCode.trim() !== ''} href="">
					{language[1]}
				</a>
			</li>
		{/each}
	</ul>

	<div>
		<textarea bind:value={inputCode} on:input={prettifyCodeTimeout} class:uk-form-danger={inputCodeError} class="uk-textarea uk-width-1-1 sk-monospace" placeholder="Code..."></textarea>
	</div>

	{#if outputCode !== ''}
		<div class="uk-width-1-1 uk-flex uk-flex-center uk-margin-small">
			<span class="uk-width-auto" uk-icon="icon: arrow-down; ratio: 3" uk-tooltip="pos: left" title="Format"></span>
		</div>

		<div>
			<CodeBlock code={outputCode} language={codeLang === 'auto' ? detectedLang : codeLang} />
		</div>

		<button on:click={copyText(outputCode)} class="uk-button uk-button-primary uk-width-1-1 uk-margin-small-top">Copy</button>
	{/if}
</Tool>

<svelte:window bind:innerWidth />