import lxml.etree as etree

def parser(data):
	root = etree.fromstring(data.encode('utf-8'))

	properties = {}
	properties_elements = root.find(".//{http://maven.apache.org/POM/4.0.0}properties")

	if properties_elements is not None:
		for property_element in properties_elements:
			tag = property_element.xpath("substring-after(local-name(), '')")
			if tag=="":
				continue
			
			version = property_element.text

			# Check if the version is specified in property
			if version is not None and version.startswith("${") and version.endswith("}"):
				properties[tag] = properties.get(version[2:-1])
			else:
				properties[tag] = version

	dependency_dict = {}
	dependency_elements = root.xpath(".//*[local-name()='dependency']")

	for dependency_element in dependency_elements:
		group_id = dependency_element.xpath(".//*[local-name()='groupId']")[0].text
		artifact_id = dependency_element.xpath(".//*[local-name()='artifactId']")[0].text
		version_element = dependency_element.xpath(".//*[local-name()='version']")
		if version_element:
			version_element = version_element[0].text
		else:
			continue

		# Check if the version is specified in property
		if version_element is not None and version_element.startswith("${") and version_element.endswith("}"):
			property_key = version_element[2:-1]
			version = properties.get(property_key, version_element)
			# print(property_key, version, version_element)
		else:
			version = version_element

		dependency_key = f"{group_id}:{artifact_id}"
		dependency_dict[dependency_key] = version
	return dependency_dict

