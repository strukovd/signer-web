<template>
	<div class="base-text-box" :class="{ 'invalid': error }" @keydown.enter="onSubmit" >
		<label>
			<div class="text-box-wrapper">
				<header class="header" style="display:flex; align-items:center; padding-right:1em;">
					<div v-if="label" class="caption-container" style="flex:auto 1 1;">
						<span class="caption">{{ label }}</span>
					</div>
					<div v-if="error" class="error-container" style="display:flex; gap:.2em; justify-content:flex-end; font-size:14px; color:red; opacity:.6; line-height:1.4em;">
						<!-- <BaseIcon name="mdi-alert-decagram" size="1.2em"/> -->
						<span class="error-message">{{ error }}</span>
					</div>
				</header>

				<div class="text-box-area">
					<BaseIcon v-if="prependIcon" class="prepend-icon" size="1.4em" :name="prependIcon"/>
					<input :type="type === 'password' ? (masked ? 'password' : 'text') : type" :placeholder="placeholder" :autofocus="autofocus" :value="valueProxy" @input="onInput"/>
					<BaseIcon @click="masked = !masked" v-if="type === 'password'" class="append-icon" size="1.4em" :name="masked ? 'mdi-eye-off' : 'mdi-eye'"/>
					<BaseIcon v-else-if="appendIcon" class="append-icon" size="1.4em" :name="appendIcon"/>
					<BaseButton v-if="button" @click="onSubmit" variant="secondary">{{ button }}</BaseButton>
				</div>
			</div>
		</label>
	</div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import BaseButton from '~/components/common/BaseButton.vue';
import BaseIcon from '~/components/common/BaseIcon.vue';

export default defineComponent({
	// TODO: добавить .lazy директиву
	name: 'BaseTextBox',
	components: { BaseButton, BaseIcon },
	emits: ['update:modelValue', 'submit'],
	props: {
		modelValue: {
			type: [String, Number] as PropType<string | number | undefined>,
		},
		label: String,
		prependIcon: String,
		appendIcon: String,
		autofocus: Boolean,
		placeholder: String,
		type: {
			type: String as () => 'text' | 'password' | 'color'
				| 'date' | 'datetime'
				| 'datetime-local' | 'month' | 'tel'
				| 'time' | 'url' | 'week' | 'email' | 'number',
			default: 'text'
		},
		button: String,
		error: String as () => string | null | undefined
	},
	data() {
		return {
			innerValue: (this.modelValue ?? '') as string | number,
			masked: false
		};
	},
	computed: {
		// Универсальный прокси: если передан v-model — читаем/пишем через проп/эмит,
		// иначе — работаем с внутренним состоянием.
		valueProxy: {
			get(): string | number {
				return this.modelValue !== undefined ? this.modelValue : this.innerValue;
			},
			set(v: string | number) {
				if (this.modelValue !== undefined) {
					this.$emit('update:modelValue', v);
				} else {
					this.innerValue = v;
				}
			}
		}
	},
	methods: {
		onSubmit(event: KeyboardEvent) {
			const valueCopy = this.modelValue !== undefined ? this.modelValue : this.innerValue;
			this.$emit('submit', valueCopy, event);
		},
		onInput(event: Event) {
			const val = (event.target as HTMLInputElement)?.value ?? '';
			this.valueProxy = this.type === 'number' ? Number(val) : val;
		}
	},
	created() {
		this.masked = this.type === 'password';
	},
	watch: {
		// Если родитель всё же начал менять modelValue — синхронизируем стартовое внутреннее значение
		modelValue(newVal) {
			if (newVal !== undefined) this.innerValue = newVal as string | number;
		}
	}
	});
</script>

<style lang="scss">
.base-text-box {
  .text-box-wrapper {
    // margin: 0 0 .6em 0;

    .caption {
      font-size: 14px;
      opacity: .6;
      line-height: 1.4em;
      margin-bottom: .4em;
    }

    .text-box-area {
      display: flex;
      align-items: center;
      white-space: nowrap;
      text-wrap: nowrap;
      font-size: 16px;
      background: #FFFFFF;
      border-radius: 6px;
      border: 1px solid #E0E2E791;
      line-height: 1.4em;
      font-weight: 500;
      box-shadow: none;
      padding: .4em .4em .4em .6em;


      &:focus-within {
        box-shadow: 0 0 0 2px #0079C1aa;
      }

      & > input {
        flex: auto 1 0;
        color: inherit;
        outline: none;
        font-size: 16px;
        box-sizing: border-box;
        background: transparent;
        // padding:.5em .7em;
        padding: 0.4em .4em;
		border-style: none;

        &::placeholder {
          font-weight: 300;
          opacity: .6;
        }
      }
    }

  }

  &.invalid {
    .text-box-area {
      border-color: red;
      border-style: dashed;
      color: red;

      // outline:1px dashed red;
      // color: red;
    }
  }
}
</style>
