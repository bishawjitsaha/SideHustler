import React, { useState } from "react";

const TagSelector = ({ tags, selectedTags, setSelectedTags }) => {
    const [dropdownTags, setDropdownTags] = useState(tags);

    const handleSelectTag = (tag) => {
        setSelectedTags([...selectedTags, tag].sort());
        setDropdownTags(dropdownTags.filter((t) => t !== tag));
    };

    const handleDeselectTag = (tag) => {
        setSelectedTags(selectedTags.filter((t) => t !== tag));
        setDropdownTags([...dropdownTags, tag].sort());
    };

    return (
        <div>
            <div className="flex items-center space-x-2">
                <label className="text-gray-700 text-m">Tags:</label>
                <select
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm w-auto mb-2"
                    onChange={(e) => handleSelectTag(e.target.value)}
                    value=''
                >
                    <option value="" disabled>Select a tag</option>
                    {dropdownTags.map((tag, index) => (
                        <option key={index} value={tag}>
                            {tag}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                {selectedTags.map((tag, index) => (
                    <span
                        key={index}
                        className="relative inline-flex items-center bg-blue-200 rounded-full px-2 py-1 text-sm text-blue-700 mr-2 mb-2 cursor-pointer hover:bg-blue-300"
                        // className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
                        onClick={() => handleDeselectTag(tag)}
                    >
                        {tag}
                        <span
                            className="absolute right-0 top-0 transform translate-x-1/2 -translate-y-1/2 bg-white rounded-full text-xs px-1 cursor-pointer hover:bg-red-500 hover:text-white"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeselectTag(tag);
                            }}
                        >
                            x
                        </span>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default TagSelector;
