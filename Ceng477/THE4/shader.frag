#version 330

// Output Color
out vec4 color;

uniform mat4 MVP; // ModelViewProjection Matrix
uniform mat4 MV; // ModelView idMVPMatrix
uniform vec3 cameraPosition;

// Texture-related data;
uniform sampler2D rgbTexture;
uniform int widthTexture;
uniform int heightTexture;
uniform int textureShift;

// Data from Vertex Shader
in vec2 textureCoordinate;
in vec3 vertexNormal; // For Lighting computation
in vec3 ToLightVector; // Vector from Vertex to Light;
in vec3 ToCameraVector; // Vector from Vertex to Camera;


vec3 lightSourceIntensity = vec3(1.0,1.0,1.0);

void main() {

  // Assignment Constants below
  // get the texture color
  vec4 textureColor = texture(rgbTexture, textureCoordinate);

  // apply Phong shading by using the following parameters
  vec4 ka = vec4(0.25,0.25,0.25,1.0); // reflectance coeff. for ambient
  vec4 Ia = vec4(0.3,0.3,0.3,1.0); // light color for ambient
  vec4 Id = vec4(1.0, 1.0, 1.0, 1.0); // light color for diffuse
  vec4 kd = vec4(1.0, 1.0, 1.0, 1.0); // reflectance coeff. for diffuse
  vec4 Is = vec4(1.0, 1.0, 1.0, 1.0); // light color for specular
  vec4 ks = vec4(1.0, 1.0, 1.0, 1.0); // reflectance coeff. for specular
  int specExp = 100; // specular exponent

  // compute ambient component
  vec4 ambient = ka*Ia;
  // compute diffuse component
  vec4 diffuse = kd*vec4((max(0,dot(ToLightVector,vertexNormal)))*lightSourceIntensity,1);
  // compute specular component
  vec3 halfVector = ToLightVector+ToCameraVector;
  halfVector = normalize(halfVector);
  vec4 specular = ks*vec4(pow(max(0,dot(halfVector,vertexNormal)),specExp)*lightSourceIntensity,1);

  // compute the color using the following equation
  color = vec4(clamp( textureColor.xyz * vec3(ambient + diffuse + specular), 0.0, 1.0), 1.0);
  //color = textureColor;
}
