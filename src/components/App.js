import React, { Component } from "react";
import { AppProvider } from "@shopify/polaris";
import '@shopify/polaris/styles.css';
import PageLayout from './PageLayout';
import { removeExtraneous } from './helpers';

const arrayMove = require('array-move');

class App extends Component {
  state = {
    type: 'section',
    fields: { settings: [], blocks: [] },
    testMode: true,
  };

  addSettingsItem = (settingsItem, blockIndex) => {
    const fields =  { ...this.state.fields };
    if (blockIndex >= 0) {
      fields.blocks[blockIndex].settings.push(settingsItem);
    } else {
      fields.settings.push(settingsItem);
    }
    this.setState({ fields });
  };
  
  moveSettingsItem  = (index, destination, blockIndex = undefined) => {
    let fields = { ...this.state.fields };
    if (blockIndex >= 0) {
      fields.blocks[blockIndex].settings = arrayMove(fields.blocks[blockIndex].settings, index, destination);
    } else {
      fields.settings = arrayMove(fields.settings, index, destination);
    }
    this.setState({ fields });
  }

  updateSettingsItem = (index, updatedSettingsItem, blockIndex) => {
    const fields = { ...this.state.fields };
    if (blockIndex >= 0) {
      fields.blocks[blockIndex].settings[index] = updatedSettingsItem;
      fields.blocks[blockIndex].settings[index].options = updatedSettingsItem.options;
    } else {
      fields.settings[index] = updatedSettingsItem;
      fields.settings[index].options = updatedSettingsItem.options;
    }
    this.setState({ fields });
  };

  deleteSettingsItem = (index, blockIndex) => {
    const fields = { ...this.state.fields };
    if (blockIndex >= 0) {
      fields.blocks[blockIndex].settings.splice(index, 1);
    } else {
      fields.settings.splice(index, 1);
    }
    this.setState({ fields });
  };

  handleFieldChange = (input, value, blockIndex) => {
    const fields = {  ...this.state.fields };
    blockIndex >= 0 ? fields.blocks[blockIndex][input] = value : fields[input] = value;
    
    if (value === '') { 
      const desiredFields = Object.keys(fields).filter(field => field !== input );
      const fieldsWithRemoved = removeExtraneous(fields, desiredFields);
      this.setState({ fields: fieldsWithRemoved });
    } else {
      this.setState({ fields });
    }
  }

  addBlock = () => {
    const fields =  { ...this.state.fields };
    if (fields.blocks.length === 0) {
      fields.max_blocks = 1;
    }
    fields.blocks.push({ type: '', name: '', settings: [] });
    this.setState({ fields });
  }

  deleteBlock = (blockIndex) => {
    const fields =  { ...this.state.fields };
    fields.blocks.splice(blockIndex, 1);
    if (fields.blocks.length === 0) {
      const desiredFields = Object.keys(fields).filter(field => field !== 'max_blocks' );
      const fieldsWithRemoved = removeExtraneous(fields, desiredFields); 
      this.setState({ fields: fieldsWithRemoved });    
    } else {
      this.setState({ fields });    
    }
  }

  render() {
    const { type, fields: { settings, blocks }, fields } = this.state;
    return (
      <AppProvider>
        <PageLayout
          type={type}
          handleFieldChange={this.handleFieldChange}
          fields={fields}
          settingItems={settings}
          blocks={blocks}
          addSettingItem={this.addSettingsItem}
          updateSettingItem={this.updateSettingsItem}
          deleteSettingItem={this.deleteSettingsItem}
          moveSettingItem={this.moveSettingsItem}
          addBlock={this.addBlock}
          deleteBlock={this.deleteBlock}
        />
      </AppProvider>
    );
  }
}

export default App;