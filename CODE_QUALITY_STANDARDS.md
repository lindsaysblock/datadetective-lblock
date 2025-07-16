🚀 Code Quality & Maintainability Standards

This document describes the enforced quality standards for this codebase.
It ensures our product remains high-performing, maintainable, and scalable as we grow.

⸻

📏 File & Component Structure

✅ File length:
	•	Any file >220 lines must be split.
	•	Move business logic to helpers, custom hooks, or slice into smaller UI components.

✅ Hooks:
	•	If a component uses >5 React hooks (useState, useEffect, useMemo, etc), factor them into a custom hook.

✅ Max nesting:
	•	Functions must not exceed 3 levels of nested logic (early return preferred).
	•	If complexity grows, split into smaller pure functions.

⸻

🧩 Coding Practices

✅ Strong typing:
	•	Always use explicit TypeScript interfaces & types.
	•	No implicit any, enforce strict: true.

✅ Memoization:
	•	Use useMemo or useCallback for any heavy data transformations, event handlers in lists, or derived state.

✅ Constants & enums:
	•	No magic numbers or strings.
	•	Centralize in a constants file or enums.

✅ Early return style:
	•	Avoid deeply nested if/else; return early when possible.

✅ Destructure props & state:
	•	Keeps dependencies explicit and easier to refactor.

⸻

⚙️ Linting & CI Enforcement

✅ ESLint:
	•	Enforces:
	•	Max file lines (220)
	•	Max complexity (5)
	•	No unused imports
	•	No magic numbers (except 0, 1, array indices)

✅ Prettier:
	•	Enforces consistent code style on commit.

✅ Type checks:
	•	CI blocks merges with type errors.

✅ Husky & lint-staged:
	•	Auto-formats and fixes issues before commit.

⸻

🚦 CI & Automated Checks

✅ Pull requests fail if:
	•	TypeScript errors are present.
	•	ESLint rules are violated (complexity, max lines, unused code).
	•	Prettier format is incorrect.

⸻

💪 Future Maintainability Goals
	•	✅ Keep functions <10 lines wherever possible.
	•	✅ Push repeated logic into helpers or hooks.
	•	✅ Ensure all configuration (flows, questions, schema) lives in JSON or typed config files.
	•	✅ Document all helpers with JSDoc or inline comments.
