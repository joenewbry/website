# Can consumer hardware provide useful compute?

Research date: October 27, 2026.
Source session: “Another thing based on this: …” (abbreviated original title).

Confirmed: M2 Pro 16 GB. Assumed: newer Mac M3/M4 family, 32 GB planning budget; iPhone 16 family. No personal inference benchmark performed.

## Published generation speeds

All rates are generated tokens/second. Hardware, workloads and runtimes differ. Do not rank devices across datasets.

### Mac base

- M2: 21.91. 10 GPU cores · build 8e672ef. Community benchmark. [Source](https://github.com/ggml-org/llama.cpp/discussions/4167).
- M3: 21.34. 10 GPU cores · build 8e672ef. Community benchmark. [Source](https://github.com/ggml-org/llama.cpp/discussions/4167).
- M4: 24.11. 10 GPU cores · build 8e672ef. Community benchmark. [Source](https://github.com/ggml-org/llama.cpp/discussions/4167).
- M5: 31.88. 10 GPU cores · 16 GB Air · build c1d0e7a. Community benchmark. [Source](https://github.com/ggml-org/llama.cpp/discussions/4167).
- M6: No verified result. Announced; no verified result in this dataset. No result. [Source](https://www.apple.com/newsroom/2026/10/apple-introduces-the-new-14-inch-macbook-pro-with-m6/).

### Mac Pro

- M2 Pro: 37.87. 16 GPU cores · build 8e672ef · your chip family. Community benchmark. [Source](https://github.com/ggml-org/llama.cpp/discussions/4167).
- M3 Pro: 30.74. 18 GPU cores · build 8e672ef · newer-Mac scenario. Community benchmark. [Source](https://github.com/ggml-org/llama.cpp/discussions/4167).
- M4 Pro: 50.74. 20 GPU cores · build 8e672ef · newer-Mac scenario. Community benchmark. [Source](https://github.com/ggml-org/llama.cpp/discussions/4167).
- M5 Pro: 66.33. 20 GPU cores · 64 GB · August 31, 2026 submission. Community benchmark. [Source](https://github.com/ggml-org/llama.cpp/discussions/4167).
- M6 family: No verified result. No verified result; no M6 Pro specification assumed. No result. [Source](https://www.apple.com/newsroom/2026/10/apple-introduces-the-new-14-inch-macbook-pro-with-m6/).

### Mac Max

- M2 Max: 65.95. 38 GPU cores · build 8e672ef. Community benchmark. [Source](https://github.com/ggml-org/llama.cpp/discussions/4167).
- M3 Max: 66.31. 40 GPU cores · build 8e672ef. Community benchmark. [Source](https://github.com/ggml-org/llama.cpp/discussions/4167).
- M4 Max: 83.06. 40 GPU cores · build 8e672ef. Community benchmark. [Source](https://github.com/ggml-org/llama.cpp/discussions/4167).
- M5 Max: 119.92. 40 GPU cores · 128 GB · build c1d0e7a. Community benchmark. [Source](https://github.com/ggml-org/llama.cpp/discussions/4167).
- M6 family: No verified result. No verified result; no M6 Max specification assumed. No result. [Source](https://www.apple.com/newsroom/2026/10/apple-introduces-the-new-14-inch-macbook-pro-with-m6/).

### iPhone: TinyLlama 1.1B Q4_0

- iPhone 14 generation: 54.24. Tested: 14 Pro · A16 · TinyLlama 1.1B Q4_0. Community benchmark. [Source](https://github.com/ggml-org/llama.cpp/discussions/4508).
- iPhone 15 generation: 56.86. Tested: 15 Pro · A17 Pro · TinyLlama 1.1B Q4_0. Community benchmark. [Source](https://github.com/ggml-org/llama.cpp/discussions/4508).
- iPhone 16 generation: 69.77. Tested: 16 Pro · A18 Pro · TinyLlama 1.1B Q4_0. Community benchmark. [Source](https://github.com/ggml-org/llama.cpp/discussions/4508).
- iPhone 17 generation: 87.33. Tested: iPhone Air · A19 Pro, 5 GPU cores · TinyLlama 1.1B Q4_0. Community benchmark. [Source](https://github.com/ggml-org/llama.cpp/discussions/4508).
- iPhone 18 generation: No verified result. No verified same-workload result in this dataset. No result. [Source](https://www.apple.com/newsroom/2026/09/apple-debuts-iphone-18-pro-and-iphone-18-pro-max/).

### Android: mixed workloads

- Snapdragon 8 Gen 2: 14.63. Galaxy S23 · Qwen3.5 2B Q4_K_M · llama.cpp CPU. Community benchmark. [Source](https://github.com/ggml-org/llama.cpp/discussions/22791).
- Snapdragon 8 Gen 3: 20. Llama 2 7B · Qualcomm demo · up to 20, not a typical rate. Vendor claim. [Source](https://www.qualcomm.com/content/dam/qcomm-martech/dm-assets/documents/Unlocking-on-device-generative-AI-with-an-NPU-and-heterogeneous-computing.pdf).
- Snapdragon 8 Elite: 40.21. Galaxy S25 · Qwen3-1.7B w4a16 · GenieX QAIRT · 512 context. Vendor benchmark. [Source](https://aihub.qualcomm.com/mobile/models/qwen3_1_7b).
- Snapdragon 8 Elite Gen 5: 43.5. Galaxy S26 · Qwen3-1.7B w4a16 · GenieX QAIRT · 512 context. Vendor benchmark. [Source](https://aihub.qualcomm.com/mobile/models/qwen3_1_7b).
- Snapdragon 8 Elite Gen 6: No verified result. Announced; no verified result in this dataset. No result. [Source](https://www.qualcomm.com/news/releases/2026/09/snapdragon-leads-the-agentic-ai-age-with-two-of-the-world-s-fast).

### Reasoning examples: mixed workloads

- M2 Pro · 16 GB: 23.1. DeepSeek-R1-0528-Qwen3-8B · Q4_K_M · LocalScore. Community benchmark. [Source](https://www.localscore.ai/model/1682).
- M2 Pro · 32 GB reference: 96.3. Qwen3-1.7B · 4-bit · oMLX · 4,096 context. Community benchmark. [Source](https://omlx.ai/benchmarks/performance/v1mz5mqa).
- M4 Pro reference: 96. LFM2.5-1.2B-Thinking · INT8 · Cactus CPU. Vendor benchmark. [Source](https://www.liquid.ai/blog/lfm2-5-1-2b-thinking-on-device-reasoning-under-1gb).
- A19 Pro reference: 64. LFM2.5-1.2B-Thinking · INT8 · Cactus CPU. Vendor benchmark. [Source](https://www.liquid.ai/blog/lfm2-5-1-2b-thinking-on-device-reasoning-under-1gb).
- Snapdragon 8 Elite reference: 82. ROG Phone 9 Pro · LFM2.5-1.2B-Thinking · Nexa neural processor. Vendor benchmark. [Source](https://www.liquid.ai/blog/lfm2-5-1-2b-thinking-on-device-reasoning-under-1gb).

## Model fit recommendations

Download is approximate quantized file size, not working memory. Use short context; fit is conditional on runtime support and free memory.

- [LFM2.5-1.2B-Thinking](https://huggingface.co/LiquidAI/LFM2.5-1.2B-Thinking): ~0.7–1.3 GB download. iPhone: Start here; 16 GB Mac: Easy fit; 32 GB Mac: Easy fit. Compact reasoning for extraction and narrow tasks; the author cautions against knowledge-heavy work and programming. Custom Liquid license.

- [Qwen3-1.7B](https://huggingface.co/Qwen/Qwen3-1.7B): ~1–1.5 GB download. iPhone: Start here; 16 GB Mac: Easy fit; 32 GB Mac: Easy fit. Switchable thinking mode. Use a 4-bit build and limit the reasoning budget. Apache 2.0.

- [DeepSeek-R1-Distill-Qwen-1.5B](https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B): ~1–1.5 GB download. iPhone: Try it; 16 GB Mac: Easy fit; 32 GB Mac: Easy fit. Older compact reasoning distill; useful for experiments, less capable than larger models. MIT.

- [Qwen3.5-2B](https://huggingface.co/Qwen/Qwen3.5-2B): ~2–3 GB download. iPhone: Try it*; 16 GB Mac: Easy fit; 32 GB Mac: Easy fit. Thinking is available but off by default. Requires a runtime with Qwen3.5 support. Apache 2.0.

- [Qwen3-4B-Thinking-2507](https://huggingface.co/Qwen/Qwen3-4B-Thinking-2507): ~2.5–3 GB download. iPhone: Conditional*; 16 GB Mac: Good starter; 32 GB Mac: Easy fit. Dedicated reasoning model. Phone use needs short context and a compatible app. Apache 2.0.

- [Qwen3.5-4B](https://huggingface.co/Qwen/Qwen3.5-4B): ~3–4 GB download. iPhone: Conditional*; 16 GB Mac: Good starter; 32 GB Mac: Easy fit. Thinking enabled by default. Start with a 4-bit build and 4K context. Apache 2.0.

- [DeepSeek-R1-0528-Qwen3-8B](https://huggingface.co/deepseek-ai/DeepSeek-R1-0528-Qwen3-8B): ~5–6 GB download. iPhone: Skip initially; 16 GB Mac: Good fit; 32 GB Mac: Easy fit. Published M2 Pro 16 GB reference: 23.1 generated tokens/s. MIT.

- [Qwen3.5-9B](https://huggingface.co/Qwen/Qwen3.5-9B): ~6–8 GB download. iPhone: Skip initially; 16 GB Mac: With headroom; 32 GB Mac: Good fit. Leave memory for macOS, apps and conversation cache. Apache 2.0.

- [gpt-oss-20b](https://huggingface.co/openai/gpt-oss-20b): ~12–14 GB download. iPhone: Skip; 16 GB Mac: Tight / trial only; 32 GB Mac: Good candidate. OpenAI reasoning model with low/medium/high effort. Use a supported quantized build; all experts still need storage. Apache 2.0.

- [Qwen3-30B-A3B-Thinking-2507](https://huggingface.co/Qwen/Qwen3-30B-A3B-Thinking-2507): ~18–20 GB download. iPhone: Skip; 16 GB Mac: Skip; 32 GB Mac: Conditional*. 30B total parameters, about 3B active per token. Reserve memory for the full model plus cache. Apache 2.0.

## Methodology

Charts use published single-stream decode rates. The older Mac/iPhone benchmark models are not reasoning recommendations. M2–M4 Mac rows use build 8e672ef; M5 uses newer software. Android rows mix workloads; only the two Qwen3-1.7B GenieX QAIRT rows are closely matched (w4a16, 512 context). Those metrics were extracted from public Qualcomm AI Hub page data; its visible table returned an inconsistent unsupported message. Source snapshots preserve the data.

The reasoning latency calculator uses (thinking tokens + 256 answer tokens) / tokens per second. It excludes prompt reading, loading, queue and network latency. It is a scenario, not a benchmark. No invented rates fill missing generations.

Latest announced generations include M6 (MacBook Pro announced October 27; ships November 6), iPhone18, and Snapdragon 8 Elite Gen6. Android coverage is Snapdragon flagship only.

A harness should record model hash, runtime, quantization, input/output lengths, first-token latency, peak memory, 20-minute thermal stability, energy and task correctness. No worker installation is included.

## Sources

- [llama.cpp M-series benchmarks](https://github.com/ggml-org/llama.cpp/discussions/4167)
- [llama.cpp A-series benchmarks](https://github.com/ggml-org/llama.cpp/discussions/4508)
- [Galaxy S23 benchmark and backend comparison](https://github.com/ggml-org/llama.cpp/discussions/22791)
- [Qualcomm: Llama 2 7B demo, up to 20 tokens/s](https://www.qualcomm.com/content/dam/qcomm-martech/dm-assets/documents/Unlocking-on-device-generative-AI-with-an-NPU-and-heterogeneous-computing.pdf)
- [Qualcomm AI Hub: Qwen3-1.7B metrics](https://aihub.qualcomm.com/mobile/models/qwen3_1_7b)
- [Liquid AI: LFM2.5-1.2B-Thinking benchmarks](https://www.liquid.ai/blog/lfm2-5-1-2b-thinking-on-device-reasoning-under-1gb)
- [LocalScore: DeepSeek R1 0528 Qwen3 8B](https://www.localscore.ai/model/1682)
- [oMLX: Qwen3-1.7B on M2 Pro, 32 GB](https://omlx.ai/benchmarks/performance/v1mz5mqa)
- [Apple: M6 MacBook Pro announcement, October 27, 2026](https://www.apple.com/newsroom/2026/10/apple-introduces-the-new-14-inch-macbook-pro-with-m6/)
- [Apple: iPhone 18 Pro announcement](https://www.apple.com/newsroom/2026/09/apple-debuts-iphone-18-pro-and-iphone-18-pro-max/)
- [Qualcomm: Snapdragon 8 Elite Gen 6 announcement](https://www.qualcomm.com/news/releases/2026/09/snapdragon-leads-the-agentic-ai-age-with-two-of-the-world-s-fast)
- [OpenAI: gpt-oss-20b](https://developers.openai.com/api/docs/models/gpt-oss-20b)
- [OpenAI: running gpt-oss locally with Ollama](https://developers.openai.com/cookbook/articles/gpt-oss/run-locally-ollama)
- [Ollama: Qwen3.5 model downloads](https://ollama.com/library/qwen3.5)
- [PocketPal: open-source iOS and Android app](https://github.com/a-ghorbani/pocketpal-ai)
- [MLX LM: Apple Silicon inference and benchmarking](https://github.com/ml-explore/mlx-lm)
