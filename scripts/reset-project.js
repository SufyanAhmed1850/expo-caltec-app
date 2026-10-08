#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const root = process.cwd();
const exampleDir = path.join(root, 'example');
const directoriesToHandle = ['src', 'scripts'];
const appDir = path.join(root, 'src', 'app');

const indexContent = `import { Text, View, StyleSheet } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Edit src/app/index.tsx to edit this screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
`;

const layoutContent = `import { Stack } from 'expo-router';

export default function RootLayout() {
  return <Stack />;
}
`;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const moveOrDeleteDirectories = async (shouldMove) => {
    try {
        if (shouldMove) {
            await fs.promises.mkdir(exampleDir, { recursive: true });
            console.log('Created /example.');
        }

        for (const directory of directoriesToHandle) {
            const currentPath = path.join(root, directory);

            if (!fs.existsSync(currentPath)) {
                console.log(`Skipping missing /${directory}.`);
                continue;
            }

            if (shouldMove) {
                const targetPath = path.join(exampleDir, directory);
                await fs.promises.rename(currentPath, targetPath);
                console.log(`Moved /${directory} to /example/${directory}.`);
            } else {
                await fs.promises.rm(currentPath, {
                    recursive: true,
                    force: true,
                });
                console.log(`Deleted /${directory}.`);
            }
        }

        await fs.promises.mkdir(appDir, { recursive: true });
        await fs.promises.writeFile(path.join(appDir, 'index.tsx'), indexContent);
        await fs.promises.writeFile(
            path.join(appDir, '_layout.tsx'),
            layoutContent
        );

        console.log('Created a fresh src/app directory.');
        console.log('Next steps:');
        console.log('1. Run `npx expo start`.');
        console.log('2. Edit src/app/index.tsx.');
        if (shouldMove) {
            console.log('3. Delete /example when you no longer need it.');
        }
    } catch (error) {
        console.error(`Reset failed: ${error.message}`);
    }
};

rl.question(
    'Move existing files to /example instead of deleting them? (Y/n): ',
    (answer) => {
        const normalized = answer.trim().toLowerCase() || 'y';

        if (normalized !== 'y' && normalized !== 'n') {
            console.log("Invalid input. Enter 'Y' or 'N'.");
            rl.close();
            return;
        }

        moveOrDeleteDirectories(normalized === 'y').finally(() => rl.close());
    }
);
