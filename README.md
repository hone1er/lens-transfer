# Lens Transfer

Lens Transfer is a simple web application that allows users to transfer their lens profile and handle NFTs to a different address. It is built using the T3 Stack, which includes Next.js, wagmi, viem, Tailwind CSS, and shadCN.

## Features

- Sign in with your wallet
- View lens profile and handle NFTs
- Disable guardian and initiate 7 day cooldown
- Transfer lens profile and handle NFTs to a different address

## Getting Started

First, add the contracts to your .env file:

```bash
NEXT_PUBLIC_LENS_HANDLE_CONTRACT ="0xe7E7EaD361f3AaCD73A61A9bD6C10cA17F38E945"
NEXT_PUBLIC_LENS_PROFILE_CONTRACT ="0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d"
```

Then, install the dependencies defined in the package.json:

```bash
pnpm install
```

And then, run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contribution Guide

We welcome contributions to Lens Transfer! Here's how you can get involved:

### Reporting Issues

If you encounter any bugs or have suggestions for improvements, please open an issue on our GitHub repository. Provide as much detail as possible to help us understand and address the problem.

### Making Changes

1. **Fork the repository**: Click the "Fork" button at the top right of our GitHub repository page and create your own copy of the project.

2. **Clone your fork**: Clone your forked repository to your local machine using:
   ```bash
   git clone https://github.com/your-username/lens-transfer.git
   ```

Create a new branch: Create a new branch for your changes with a descriptive name:

```bash
Copy code
git checkout -b feature/your-feature-name
```

Make your changes: Implement your changes in the new branch. Ensure your code follows our coding standards and is well-documented.

Update tests: If your changes affect existing functionality or add new features, please update or add tests accordingly.

Commit your changes: Commit your changes with a clear and concise commit message:

```bash
Copy code
git commit -m "Add feature: your-feature-name"
```

Push to your fork: Push your changes to your forked repository:

```bash
Copy code
git push origin feature/your-feature-name
```

Open a pull request: Navigate to the original repository and open a pull request from your new branch. Provide a detailed description of your changes and any relevant information.

## Code Review Process

Your pull request will be reviewed by one of our maintainers. They may request changes or provide feedback. Please be responsive to their comments and make the necessary updates.

## Style Guide

Please adhere to the coding standards used in the project. This includes following the structure and conventions of the existing codebase. Consistent formatting, meaningful variable names, and comprehensive comments are essential.

## Documentation

Ensure that any new features or significant changes are well-documented. Update the README.md file or other relevant documentation files as necessary.

## Learn More

lens - [Documentation](https://lens.xyz/docs)

ShadCN - [Documentation](https://ui.shadcn.com/docs/)

Viem - [Documentation](https://viem.sh/)

Wagmi - [Documentation](https://wagmi.sh)

Next.js - [Documentation](https://nextjs.org/docs)

Tailwind CSS - [Documentation](https://tailwindcss.com/docs)

## License

Copyright 2024 Lens Transfer

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
