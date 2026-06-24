---
title: Dropbox
description: Train your ContextGPT chatbot with content from Dropbox
sidebarTitle: Dropbox
icon: dropbox
---

# Dropbox Integration

Import documents, PDFs, and text files from your Dropbox to train your ContextGPT chatbot. Perfect for teams using Dropbox as their document hub for support content, FAQs, and product guides.

## Prerequisites

- A Dropbox account (Basic, Plus, Professional, or Business)
- Files you want to import must be accessible to your Dropbox account
- Owner or Editor permissions on the ContextGPT chatbot

## Connecting Dropbox

<Steps>
  <Step title="Navigate to Training">
    Go to your chatbot dashboard and click the **Training** tab
  </Step>

  <Step title="Add Data Source">
    Click **Add Data Source** and select **Dropbox**
  </Step>

  <Step title="Authenticate">
    Click **Connect Dropbox** and sign in with your Dropbox credentials. Grant ContextGPT permission to read your files.
  </Step>

  <Step title="Select Content">
    Browse your Dropbox and select the files or folders you want to import:

    * Individual files
    * Entire folders (all supported files within)
    * Team folders (if using Dropbox Business)

  </Step>

  <Step title="Start Training">
    Click **Import Selected** to begin training. ContextGPT will process each file and add the content to your chatbot's knowledge base.
  </Step>
</Steps>

## Supported File Types

| File Type     | Extensions              |
| ------------- | ----------------------- |
| Documents     | .doc, .docx, .txt, .rtf |
| Spreadsheets  | .xls, .xlsx, .csv       |
| Presentations | .ppt, .pptx             |
| PDFs          | .pdf                    |
| Markup        | .html, .md, .markdown   |

<Note>
  Only text-based content is extracted for training. Images, videos, and other media files are skipped.
</Note>

## Best Practices

### Organize with Folders

Create a dedicated folder structure for your chatbot content:

```
📁 ContextGPT Content/
  ├── 📄 Product FAQ.pdf
  ├── 📄 Getting Started Guide.docx
  ├── 📁 Knowledge Base/
  │   ├── 📄 Account Setup.docx
  │   └── 📄 Billing Questions.docx
  └── 📁 Support Articles/
      ├── 📄 Troubleshooting.pdf
      └── 📄 Common Issues.docx
```

### Keep Content Fresh

- **Re-import regularly**: Sync your Dropbox content periodically to capture updates
- **Use descriptive names**: Clear file names help organize your training data
- **Remove outdated files**: Delete old content from your source folder before re-importing

### What to Include

<AccordionGroup>
  <Accordion title="Good Content for Training">
    * FAQs and knowledge base articles
    * Product documentation and guides
    * Support playbooks and troubleshooting guides
    * Policy documents and terms
  </Accordion>

  <Accordion title="Content to Avoid">
    * Internal-only documents with sensitive information
    * Outdated or deprecated content
    * Large files with minimal text (image-heavy presentations)
    * Duplicate content (same info in multiple files)
  </Accordion>
</AccordionGroup>

## Troubleshooting

<AccordionGroup>
  <Accordion title="Files not appearing">
    * Ensure you've granted ContextGPT full read access to your Dropbox
    * Check that files are in supported formats
    * Verify the files aren't in a restricted team folder
  </Accordion>

  <Accordion title="Import fails or times out">
    * Try importing smaller batches of files
    * Check that individual files aren't corrupted
    * Ensure you have a stable internet connection
  </Accordion>

  <Accordion title="Content not updating">
    * Re-import the folder to pull latest changes
    * Remove and re-add the data source if changes aren't reflected
  </Accordion>
</AccordionGroup>

## Dropbox Business

For Dropbox Business accounts:

- **Team folders**: Import content from shared team folders
- **Admin access**: Team admins can connect team-wide folders
- **Permissions**: Only folders you have access to will appear

<Info>
  When connecting a Dropbox Business account, you'll see both your personal folders and team folders you have access to.
</Info>
