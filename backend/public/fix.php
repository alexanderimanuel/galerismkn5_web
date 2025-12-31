<?php
// Bypass Laravel entirely for raw debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "<h1>Raw Storage Fix Tool</h1>";

// Calculate paths relative to public/ folder
$targetRelative = '../storage/app/public';
$target = realpath(__DIR__ . '/../storage/app/public');
$link = __DIR__ . '/storage';

echo "Target (Real): " . ($target ?: 'NOT FOUND (' . __DIR__ . '/' . $targetRelative . ')') . "<br>";
echo "Link (Public): $link<br>";

// 1. Check Target
if (!$target) {
    echo "Target directory missing. Creating... ";
    $targetPath = __DIR__ . '/../storage/app/public';
    if (!file_exists($targetPath)) {
        if (mkdir($targetPath, 0755, true)) {
            echo "OK (Created $targetPath)<br>";
            $target = realpath($targetPath);
        } else {
            echo "FAILED to create target directory. Permission denied?<br>";
            exit;
        }
    }
} else {
    echo "Target directory exists.<br>";
}

// 2. Cleanup Link
if (file_exists($link)) {
    echo "Link/Folder 'storage' already exists in public. Checking type... ";

    if (is_link($link)) {
        echo "It is a SYMLINK. Removing... ";
        if (unlink($link))
            echo "OK<br>";
        else
            echo "FAILED to unlink.<br>";
    } elseif (is_dir($link)) {
        echo "It is a DIRECTORY (Not a link). Renaming to storage_backup... ";
        if (rename($link, $link . '_backup_' . time()))
            echo "OK<br>";
        else
            echo "FAILED to rename directory.<br>";
    } else {
        echo "It is a FILE. Removing... ";
        if (unlink($link))
            echo "OK<br>";
        else
            echo "FAILED to remove file.<br>";
    }
}

// 3. Create Symlink
echo "Creating symlink from [$target] to [$link]... ";
try {
    if (symlink($target, $link)) {
        echo "<h2 style='color:green'>SUCCESS! Symlink created.</h2>";
        echo "Please check your Android App now. Images should appear.<br>";
        echo "<br><b>Security:</b> Please delete this file (public/fix.php) from your repository after verification.";
    } else {
        echo "<h2 style='color:red'>FAILED!</h2>";
        $error = error_get_last();
        echo "Error: " . print_r($error, true);
    }
} catch (Throwable $e) {
    echo "<h2 style='color:red'>EXCEPTION!</h2>";
    echo $e->getMessage();
}
